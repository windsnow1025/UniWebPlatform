import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';

mkdirSync('uploads', { recursive: true });

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}-${Date.now()}`);
    },
  }),
};
