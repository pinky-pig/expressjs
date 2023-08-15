/* eslint-disable no-console */
import express from 'express'

const router = express.Router()

const axios = require('axios')

const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com'
const OWNER = 'pinky-pig' // GitHub 用户名
const REPO = 'Arvin' // 仓库名
const BRANCH = 'refactor/content/weekly' // 分支名，注意这里使用的是分支名

// 读取路径下的单个文件内容
async function getFileContent(filePath) {
  try {
    const response = await axios.get(`${GITHUB_RAW_URL}/${OWNER}/${REPO}/${BRANCH}/${filePath}`)
    return response.data
  }
  catch (error) {
    console.error('Error fetching file content:', error)
    throw error
  }
}

// 读取路径下的文件目录
async function getDirectoryContents() {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
    )
    const tree = response.data.tree

    const files = tree
      .filter(item => item.type === 'blob') // 过滤出文件
      .map(item => item.path) // 获取文件路径

    return files
  }
  catch (error) {
    console.error('Error fetching directory contents:', error)
    throw error
  }
}

(async () => {
  try {
    // 读取某个文件的内容
    const filePath = '01-首次记录.md' // 文件路径
    const fileContent = await getFileContent(filePath)

    console.log('File content:')
    console.log(fileContent)

    // 获取指定路径下的文件列表
    const directoryContents = await getDirectoryContents()

    console.log('Directory contents:')
    console.log(directoryContents)
  }
  catch (error) {
    console.error('Error:', error)
  }
})()

router.get('/getWeeklyCatalog', async (req, res) => {
  const directoryContents = await getDirectoryContents()
  res.send(directoryContents)
})

router.get('/getWeeklyContent', async (req, res) => {
  const filePath = '01-首次记录.md' // 文件路径
  const fileContent = await getFileContent(req.query?.url || filePath)
  res.send(fileContent)
})

export default router
