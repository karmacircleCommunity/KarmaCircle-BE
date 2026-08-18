import request from "supertest";
import { buildTestApp } from "./helpers/test-app";

const app = buildTestApp();

async function signupAndGetCookie() {
  const res = await request(app)
    .post("/auth/signup")
    .send({ email: "host@example.com", password: "hunter2", name: "Test Host" });

  const cookie = res.headers["set-cookie"]?.[0];
  if (!cookie) {
    throw new Error("signup did not return a Token cookie");
  }
  return cookie;
}

const validOnlineEvent = {
  uid: "test-event-1",
  name: "Test Event",
  description: "A test event",
  coverImage: "https://example.com/cover.png",
  mode: "Online",
  startTime: "2026-01-01T10:00:00.000Z",
  endTime: "2026-01-01T12:00:00.000Z",
  startDate: "2026-01-01T00:00:00.000Z",
  endDate: "2026-01-01T00:00:00.000Z",
};

describe("Events", () => {
  it("rejects event creation without authentication", async () => {
    const res = await request(app).post("/events/create").send(validOnlineEvent);
    expect(res.status).toBe(401);
  });

  it("creates an event for the authenticated host", async () => {
    const cookie = await signupAndGetCookie();

    const res = await request(app)
      .post("/events/create")
      .set("Cookie", cookie)
      .send(validOnlineEvent);

    expect(res.status).toBe(201);
    expect(res.body.savedEvent.uid).toBe(validOnlineEvent.uid);
    expect(res.body.savedEvent.hostUsername).toBeDefined();
  });

  it("rejects an Offline event missing location fields with 400", async () => {
    const cookie = await signupAndGetCookie();

    const res = await request(app)
      .post("/events/create")
      .set("Cookie", cookie)
      .send({ ...validOnlineEvent, uid: "test-event-2", mode: "Offline" });

    expect(res.status).toBe(400);
  });

  it("lists all events", async () => {
    const cookie = await signupAndGetCookie();
    await request(app).post("/events/create").set("Cookie", cookie).send(validOnlineEvent);

    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("finds a single event by uid", async () => {
    const cookie = await signupAndGetCookie();
    await request(app).post("/events/create").set("Cookie", cookie).send(validOnlineEvent);

    const res = await request(app).get(`/events?uid=${validOnlineEvent.uid}`);

    expect(res.status).toBe(200);
    expect(res.body.uid).toBe(validOnlineEvent.uid);
  });

  it("returns 404 for an unknown event uid", async () => {
    const res = await request(app).get("/events?uid=does-not-exist");
    expect(res.status).toBe(404);
  });
});
