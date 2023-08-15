import express from 'express'

const router = express.Router()
const axios = require('axios')

const GITHUB_API_URL = 'https://api.github.com'
const OWNER = 'pinky-pig' // GitHub 用户名
const REPO = 'Arvin' // 仓库名
const Path = '/content/weekly' // 路径

// https://api.github.com/repos/pinky-pig/Arvin/contents/content/weekly

// 读取路径下的文件目录
async function getDirectoryContents() {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${OWNER}/${REPO}/contents/${Path}`,
    )

    return {
      status: response.status,
      data: response.data,
    }
  }
  catch (error) {
    console.error('Error fetching directory contents:', error)
    throw error
  }
}

router.get('/getWeeklyCatalog', async (req, res) => {
  const directoryContents = await getDirectoryContents()
  res.send(directoryContents)
})

export default router
