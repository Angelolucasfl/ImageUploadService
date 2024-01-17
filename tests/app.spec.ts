import request from "supertest";
import { App } from "../src/app";

describe("Testing the app initialization", () => {
  it("The server should run", async () => {
    const app = new App().app;
    const response = await request(app).get("/");

    expect(response.body).toStrictEqual({ message: "Hello World!" });
  });
});
