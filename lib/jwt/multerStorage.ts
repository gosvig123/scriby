import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

export const handleFileUpload = (req: any, res: any) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  return new Promise((resolve, reject) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        reject(new Error('Error processing the file upload'));
      }
      if (!req.file || !req.file.buffer) {
        reject(new Error('No file uploaded'));
      }
      resolve(req.file.buffer);
    });
  });
};
export default handleFileUpload;
