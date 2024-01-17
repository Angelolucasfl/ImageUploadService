import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";

const MB = 5;
const FILE_SIZE_LIMITER = MB * 1024 * 1024;

const fileSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Record<string, UploadedFile | UploadedFile[]> | null | undefined;

    if (files) {
        const filesArray = Array.isArray(files) ? [files] : Object.values(files);
        const filesOverLimit: string[] = [];

        filesArray.forEach((fileOrArray) => {
            const fileArray = Array.isArray(fileOrArray) ? fileOrArray : [fileOrArray];

            fileArray.forEach((file: UploadedFile) => {
                if (file.size > FILE_SIZE_LIMITER) {
                    filesOverLimit.push(file.name);
                }
            });
        });

        if (filesOverLimit.length > 0) {
            const verb = filesOverLimit.length > 1 ? "são" : "é";
            const sentence = `Upload falhou. ${filesOverLimit.join(", ")} ${verb} maior que o tamanho limite de ${MB} MB.`;
            console.log(sentence);

            const message = filesOverLimit.length < 3 ?
                sentence.replace(",", " e") :
                sentence.replace(/,(?=[^,]*$)/, " e");

            return res.status(413).json({ status: "error",  message });
        }
    } else {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    next();
};

export default fileSizeLimiter;
