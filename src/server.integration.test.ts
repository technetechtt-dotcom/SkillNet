// @vitest-environment node
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../server/index";

describe("server integration", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it("can sign in", async () => {
    const response = await request(app)
      .post("/auth/signin")
      .send({ phone: "0801234567", password: "secret" });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toContain("access_");
    expect(response.body.refreshToken).toContain("refresh_");
    expect(response.body.user.name).toBeTruthy();
  });
});
