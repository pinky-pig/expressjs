import path from 'node:path'
import express from 'express'
import cors from 'cors'
import expressWs from 'express-ws'
import previewSiteRoute from './previewSite'
import helloRoute from './hello'
import weeklyRoute from './weekly'
import myDaysAndThings from './myDaysAndThings'

import socketRouter from './ws'

export const app = express()

app.use(cors({ origin: true }))

app.use(express.json())
app.use(express.raw({ type: 'application/vnd.custom-type' }))
app.use(express.text({ type: 'text/html' }))

app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' })
})

// 1. 静态文件路由
app.use('/static', express.static(path.join(__dirname, '../../static/')))

// 2. 测试接口，完整路径 http://localhost:3200/api/test/hello
app.use('/api/test', helloRoute)

// 3. 预览站点接口
app.use('/api/preview', previewSiteRoute)

// 4. 周报接口
app.use('/api/weekly', weeklyRoute)

// 5. 纪念日或事
app.use('/api/myDaysThings', myDaysAndThings)

expressWs(app)
app.use('/socket', socketRouter)
