// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(process.cwd(), 'public/uploads')
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' })
    }

    const file = files.file as formidable.File
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const oldPath = file.filepath
    const fileName = `${Date.now()}-${file.originalFilename}`
    const newPath = path.join(form.uploadDir, fileName)

    try {
      await fs.promises.rename(oldPath, newPath)
      const relativePath = `/uploads/${fileName}`
      res.status(200).json({ filePath: relativePath })
    } catch (error) {
      console.error('Error moving file:', error)
      res.status(500).json({ message: 'Error saving file' })
    }
  })
}