import multer from 'fastify-multer';
import path from 'path';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime()}_${file.originalname}`);
  },
  /*destination: (req, file, cb) => {
    cb(null, path.resolve('uploads'));
  }*/
});

const multerConfig = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const mimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ]
    if (mimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      throw new Error('A image precisa ser jpeg, jpg ou png');
    }
  }
});

export { multerConfig }
