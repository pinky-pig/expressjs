import express from 'express'
import playwright from 'playwright'

const router = express.Router()

async function tackScreenshot(url) {
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Page URL not defined' }),
    }
  }

  try {
    const browser = await playwright.chromium.launch()
    const page = await browser.newPage()

    await page.goto(url, {
      timeout: 5000,
      waitUntil: 'domcontentloaded',
    })

    const title = await page?.title()
    // 直接生成二进制的图片
    // const imageBuffer = await page.screenshot({ encoding: 'binary' })
    // const base64String = Buffer.from(imageBuffer).toString('base64')

    await page.screenshot({
      path: 'static/screenshots/previewSite.jpeg',
      quality: 50, // 并将质量设置为 50%，只适用于 jpeg 格式
    })

    await browser.close()

    // 将二进制转成 Base64
    // const imageBuffer = fs.readFileSync('static/screenshots/previewSite.jpeg')
    // const base64String = Buffer.from(imageBuffer).toString('base64')

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'Ok',
        page: {
          title,
          path: `${process.env.API_URL}static/screenshots/previewSite.jpeg`,
        },
      }),
    }
  }
  catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: error.toString(),
        page: {
          path: `${process.env.API_URL}static/screenshot/previewSite.jpeg`,
        },
      }),
    }
  }
}

router.get('/site', async (req, res) => {
  const response = await tackScreenshot(req.query?.url)
  res.send(response)
})

export default router
