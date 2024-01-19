import { Request, Response, NextFunction } from "express";

const filePayloadExists = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files)
    return res.status(400).json({ message: "erro: nenhum arquivo enviado", status: "Erro" });
  next();
};

export default filePayloadExists;