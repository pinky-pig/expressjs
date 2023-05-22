import path from 'node:path'
import express from 'express'
import cors from 'cors'
import previewSiteRoute from './previewSite'
import helloRoute from './hello'

export const app = express()

app.use(cors({ origin: true }))

app.use(express.json())
app.use(express.raw({ type: 'application/vnd.custom-type' }))
app.use(express.text({ type: 'text/html' }))

app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' })
})

app.use('/api/test', helloRoute)

app.use('/static', express.static(path.join(__dirname, '../../static/')))

app.use('/api/preview', previewSiteRoute)
