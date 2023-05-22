import { config } from 'dotenv'

// call after config() to access the env variables
import { app } from './api'

if (process.env.NODE_ENV !== 'production')
  config()

const port = process.env.PORT || 3200

app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`API available on http://localhost:${port}`),
)
