import supertest from "supertest";
import { regularImageFile } from "./helpers/imageMock";
import app from "../src/app";


describe("File Upload API", () => {
  it("should handle no files uploaded", async () => {
    const response = await supertest(app).post("/upload");
  
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "erro: nenhum arquivo enviado", status: "Erro" });
  });
  
  it("should handle file upload successfully", async () => {
    const response = await supertest(app)
      .post("/upload")
      .attach("files", regularImageFile.buffer, { filename: regularImageFile.originalname });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("sucesso");
  });
});