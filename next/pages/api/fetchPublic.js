import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const {filename} = req.query;

  if (!filename) {
    return res.status(400).json({error: 'Filename is required'});
  }

  const baseDir = path.join(process.cwd(), 'public');
  const safeFilename = path.basename(filename);
  const filePath = path.join(baseDir, safeFilename);

  if (!filePath.startsWith(baseDir)) {
    return res.status(403).json({error: 'Access denied'});
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({error: 'File not found'});
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  res.status(200).json({content: fileContent});
}