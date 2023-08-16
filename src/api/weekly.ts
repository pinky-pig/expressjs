import express from 'express'

const router = express.Router()
const axios = require('axios')

const matter = require('gray-matter')

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
      data: response.data as WeeklyItem[],
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

router.get('/getWeeklyFrontmatter', async (req, res) => {
  try {
    // 1. 读取文件内容
    const response = await axios.get(req.query.path)
    // 2. 解析文件内容
    const markdownContent = response.data
    // 3. 解析 frontmatter
    const parsedContent = matter(markdownContent)

    res.send({
      status: response.status,
      data: parsedContent.data,
    })
  }
  catch (error) {
    console.error('Error fetching weekly frontmatter:', error)
    throw error
  }
})

export default router

interface WeeklyItem {
  'name': string
  'path': string
  'sha': string
  'size': number
  'url': string
  'html_url': string
  'git_url': string
  'download_url': string
  'type': string
  '_links': {
    'self': string
    'git': string
    'html': string
  }
  'frontmatter'?: any
}
