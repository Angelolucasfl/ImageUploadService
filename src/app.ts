import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";
import fileUpload from "express-fileupload";
import path from "path";
import { UploadedFile } from "express-fileupload";

import { Request, Response } from "express";
import fileExtLimiter from "./middleware/fileExtLimiter";
import filePayloadExists from "./middleware/filesPayloadExists";
import fileSizeLimiter from "./middleware/fileSizeLimiter";

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cors());
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs),
    );
  }

  routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });

    this.app.post("/upload",
      fileUpload({ createParentPath: true }),
      filePayloadExists,
      fileExtLimiter([".png", ".jpg", ".jpeg"]),
      fileSizeLimiter,
      (req: Request, res: Response) => {
        const files = req.files as Record<string, UploadedFile | UploadedFile[]> | null | undefined;

        if (!files) {
          return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }

        Object.keys(files).forEach((key) => {
          const fileOrArray = files[key];

          if (Array.isArray(fileOrArray)) {
            fileOrArray.forEach((file: UploadedFile) => {
              if (file && file.name && file.mv) {
                const filePath = path.join(__dirname, "files", file.name);
                file.mv(filePath, (err) => {
                  if (err) return res.status(500).json({ status: "error", message: err });
                });
              }
            });
          } else {
            const file = fileOrArray as UploadedFile;
            if (file && file.name && file.mv) {
              const filePath = path.join(__dirname, "files", file.name);
              file.mv(filePath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err });
              });
            }
          }
        });

        return res.json({ message: Object.keys(files).toString(), status: "sucess" });
      });
  }
}

export default new App().app;
