import express from 'express'

const router = express.Router()
const { Buffer } = require('node:buffer')
const axios = require('axios')

const accessToken = ''
const repoOwner = 'pinky-pig'
const repoName = 'Arvin-days-and-things'
const filePath = 'my-days.md'

const contentToAdd = 'This is the content to add.'

router.get('/addDays', async (req, res) => {
  try {
    await addDays()
    res.send('Content added and committed successfully.')
  }
  catch (error) {
    res.status(500).send('Error adding and committing content.')
  }
})

async function addDays() {
  try {
    const response = await axios.get('https://api.github.com/repos/pinky-pig/Arvin-days-and-things/contents/my-days.md', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
    const updatedContent = `${content}\n${contentToAdd}`

    await axios.put(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
      message: 'Add content',
      content: Buffer.from(updatedContent).toString('base64'),
      sha: response.data.sha,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // eslint-disable-next-line no-console
    console.log('Content added and committed successfully.')
  }
  catch (error: any) {
    console.error('Error adding and committing content:', error.response.data)
    throw error
  }
}

export default router
