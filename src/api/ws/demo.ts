const express = require('express')
const expressWs = require('express-ws')

const router = express.Router()
expressWs(router) // 将 express 实例上绑定 websocket 的一些方法

// ws://localhost:3200/socket/user
router.ws('/user', (ws) => {
  ws.send('你连接成功了')
  ws.on('message', (msg) => {
    ws.send(`pong${msg}`)
  })
})

export default router
