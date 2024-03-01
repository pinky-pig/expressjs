const fs = require('node:fs')
const path = require('node:path')
const axios = require('axios')

async function downloadAudio(url, outputPath) {
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream',
  })

  const outputStream = fs.createWriteStream(outputPath)

  return new Promise((resolve, reject) => {
    response.data.pipe(outputStream)

    outputStream.on('finish', () => {
      outputStream.close()
      resolve()
    })

    outputStream.on('error', (err) => {
      reject(err)
    })
  })
}

async function downloadAllAudios(audioUrls, outputDir) {
  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir)

  const downloadPromises = audioUrls.map(async (url, index) => {
    const fileName = `audio_${index + 1}.mp3`
    const outputPath = path.join(outputDir, fileName)
    await downloadAudio(url, outputPath)
  })

  await Promise.all(downloadPromises)
}

const audioUrls = [
  'http://imissmybar.com/static/media/barman_working.fbac0ea5.mp3',
  'http://imissmybar.com/static/media/people_talking.322295bd.mp3',
  'http://imissmybar.com/static/media/full_room.fc972982.mp3',
  'http://imissmybar.com/static/media/rain_on_window.500dc4a4.mp3',
  'http://imissmybar.com/static/media/night_ambience.9ed79ed0.mp3',
  'http://imissmybar.com/static/media/serving_drinks.0ad626cf.mp3',
  'http://imissmybar.com/static/media/street_ambience.7cf1da37.mp3',
]

const outputDirectory = path.join(__dirname, '../../static')

downloadAllAudios(audioUrls, outputDirectory)
