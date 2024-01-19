const generateNMBBuffer = (size: number) => {
  const imageSize = size * 1024 * 1024; 
  const buffer = Buffer.alloc(imageSize, "conteúdo_base64_da_imagem", "base64");
  return buffer;
};

interface RegularImageFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    buffer: Buffer;
    mimetype: string;
    [key: string]: string | Buffer;
  }
  
export const regularImageFile: RegularImageFile = {
  fieldname: "files",
  originalname: "test-regular-image.jpg",
  encoding: "base64",
  buffer: generateNMBBuffer(4),
  mimetype: "image/jpeg",
};