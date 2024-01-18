import path from "path";
import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";

const fileExtLimiter = (allowedExtArray: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;

    if (files) {
      const fileExt: string[] = [];

      Object.keys(files).forEach(key => {
        const fileOrArray = files[key] as UploadedFile | UploadedFile[];

        if (Array.isArray(fileOrArray)) {
          fileOrArray.forEach((file: UploadedFile) => {
            if (file && file.name) {
              fileExt.push(path.extname(file.name));
            }
          });
        } else {
          const file = fileOrArray as UploadedFile;
          if (file && file.name) {
            fileExt.push(path.extname(file.name));
          }
        }
      });

      const allowed = fileExt.every(ext => allowedExtArray.includes(ext));

      if (!allowed) {
        const message = `Upload falhou. Apenas extensões de arquivo ${allowedExtArray.toString()} são permitidas.`;
        return res.status(422).json({ status: "error", message });
      }
    } else {
      res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    next();
  };
};

export default fileExtLimiter;
