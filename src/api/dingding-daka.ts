import express from 'express'

const router = express.Router()

let is_run_daka_status = false

router.get('/get_status', (req, res) => {
  res.send({ is_run_daka_status })
})

router.get('/set_status', (req, res) => {
  is_run_daka_status = Boolean(req.query.status === 'true')
  res.send({ status: 'success', is_run_daka_status })
})

export default router
