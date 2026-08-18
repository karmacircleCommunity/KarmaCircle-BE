import request from "supertest";
import { buildTestApp } from "./helpers/test-app";

const app = buildTestApp();

describe("Auth", () => {
  const credentials = { email: "jane@example.com", password: "hunter2" };

  it("signs up a new user and returns a Token cookie", async () => {
    const res = await request(app).post("/auth/signup").send(credentials);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(credentials.email);
    expect(res.body.user.password).toBeUndefined();
    expect(res.headers["set-cookie"]?.[0]).toMatch(/^Token=/);
  });

  it("rejects a duplicate signup with 409", async () => {
    await request(app).post("/auth/signup").send(credentials);
    const res = await request(app).post("/auth/signup").send(credentials);

    expect(res.status).toBe(409);
  });

  it("rejects signup with an invalid email via validation", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ email: "not-an-email", password: "hunter2" });

    expect(res.status).toBe(400);
  });

  it("signs in an existing user", async () => {
    await request(app).post("/auth/signup").send(credentials);
    const res = await request(app).post("/auth/signin").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(credentials.email);
  });

  it("rejects signin with the wrong password with 401", async () => {
    await request(app).post("/auth/signup").send(credentials);
    const res = await request(app)
      .post("/auth/signin")
      .send({ email: credentials.email, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  it("rejects signin for an unknown email with 401", async () => {
    const res = await request(app)
      .post("/auth/signin")
      .send({ email: "nobody@example.com", password: "hunter2" });

    expect(res.status).toBe(401);
  });

  describe("password update", () => {
    it("changes the password without wiping the rest of the profile", async () => {
      await request(app)
        .post("/auth/signup")
        .send({ ...credentials, name: "Jane Doe" });

      const updateRes = await request(app).post("/auth/update").send({
        email: credentials.email,
        oldPassword: credentials.password,
        newPassword: "new-password-1",
      });
      expect(updateRes.status).toBe(201);

      const oldSignin = await request(app)
        .post("/auth/signin")
        .send(credentials);
      expect(oldSignin.status).toBe(401);

      const newSignin = await request(app)
        .post("/auth/signin")
        .send({ email: credentials.email, password: "new-password-1" });
      expect(newSignin.status).toBe(200);
      expect(newSignin.body.user.name).toBe("Jane Doe");
      expect(newSignin.body.user.userName).toBeDefined();
    });

    it("rejects the wrong old password with 401", async () => {
      await request(app).post("/auth/signup").send(credentials);

      const res = await request(app).post("/auth/update").send({
        email: credentials.email,
        oldPassword: "not-the-real-password",
        newPassword: "new-password-1",
      });

      expect(res.status).toBe(401);
    });

    it("rejects an unknown email with 404", async () => {
      const res = await request(app).post("/auth/update").send({
        email: "nobody@example.com",
        oldPassword: "whatever",
        newPassword: "new-password-1",
      });

      expect(res.status).toBe(404);
    });

    it("rejects a new password under 5 characters with 400", async () => {
      await request(app).post("/auth/signup").send(credentials);

      const res = await request(app).post("/auth/update").send({
        email: credentials.email,
        oldPassword: credentials.password,
        newPassword: "abcd",
      });

      expect(res.status).toBe(400);
    });
  });
});
