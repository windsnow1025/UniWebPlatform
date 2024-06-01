import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';

mkdirSync('uploads', { recursive: true });

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      const filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
      cb(null, `${Date.now()}-${filename}`);
    },
  }),
};
