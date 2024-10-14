import { determineValueType } from '../../utils/determine-value-type'

const express = require('express')
const expressWs = require('express-ws')

const router = express.Router()
expressWs(router)

/**
 * webRTC data channel peer-to-peer 传输文件
 * ws://localhost:3200/webSocket/webRTC-p2p
 * @description: webRTC-p2p
 */

// 存储用户的连接和配对信息
const connections = {} // 用于存储每个 code 的连接
const unpairedTimeout = 3 * 60 * 1000 // 未配对超时时间 3 mins
const clearUnpairedConnectionsTimeGap = 60 * 1000 // 清理未配对连接的间隔时间 1 min

router.ws('/webRTC-p2p', (ws, _req) => {
  ws.send('连接成功')

  let heartbeatInterval

  // 处理接收到的消息
  ws.on('message', (msg) => {
    if (determineValueType(msg) === 'normalString') {
      ws.send(msg)
      return
    }

    if (determineValueType(msg) === 'jsonString') {
      const message = JSON.parse(msg)

      switch (message.type) {
        case 'send':
          // {"type":"send"}
          {
            // 生成一个唯一的 code
            const code = generateUniqueCode()
            connections[code] = {
              a: ws,
              startTime: Date.now(),
            }
            ws.send(JSON.stringify({ type: 'code', code }))
            break
          }

        case 'join':
          // {"type":"join", "code":"a1b2c3"}
          {
            const { code } = message
            const aSocket = connections[code].a

            if (aSocket) {
              connections[code] = {
                ...connections[code],
                b: ws,
                joinTime: Date.now(),
              }
              aSocket.send(JSON.stringify({ type: 'pairing_request', code }))
              // ws.send(JSON.stringify({ type: 'paired', code }))
            }
            else {
              ws.send(JSON.stringify({ type: 'error', message: 'Code not found' }))
            }
            break
          }

        case 'message':
          {
            // 处理普通消息，消息类型是 'message'
            const { code, data } = message
            const socket = connections[code]
            if (ws === socket?.a) {
              // 将普通消息转发给 B
              socket.b.send(JSON.stringify({ type: 'message', data }))
            }
            else if (ws === socket?.b) {
              // 将普通消息转发给 A
              socket.a.send(JSON.stringify({ type: 'message', data }))
            }

            break
          }

        case 'disconnect':
          {
            break
          }

        case 'ping':
          {
            ws.send(JSON.stringify(message))
            break
          }

        default:
          break
      }
    }
  })

  /**
   * 清理未配对的连接
   */
  setInterval(() => {
    cleanUnpairedConnections()
  }, clearUnpairedConnectionsTimeGap)
  function cleanUnpairedConnections() {
    const now = Date.now()
    for (const code in connections) {
      const connection = connections[code]
      if (connection && !connection.b && now - connection.startTime > unpairedTimeout) {
        delete connections[code]
      }
    }
  }

  // 处理连接关闭
  ws.on('close', () => {
    // 清除心跳定时器
    clearInterval(heartbeatInterval)
  })
})

function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 6) // 生成 6 位的随机字母和数字的组合
}
export default router
