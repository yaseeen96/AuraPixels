// test/auth.test.js
import request from "supertest";
import { expect } from "chai";
import sinon from "sinon";
import { app } from "../src/app.js";
import { User } from "../src/models/user.model.js";
import httpStatus from "http-status";

// Mock user creation and token generation
describe("POST /signup", () => {
  let userFindOneStub;
  let userCreateStub;

  beforeEach(() => {
    // Stub the User.findOne and User.create methods
    userFindOneStub = sinon.stub(User, "findOne");
    userCreateStub = sinon.stub(User, "create");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 201 and create a new user", async () => {
    const mockUser = {
      _id: "fakeUserId",
      email: "test@example.com",
      name: "Test User",
      generateAccessToken: () => "fakeAccessToken",
      generateRefreshToken: () => "fakeRefreshToken",
      save: sinon.stub().resolves(),
    };

    userFindOneStub.resolves(null); // User doesn't exist
    userCreateStub.resolves(mockUser); // Return the mock user when User.create is called

    const res = await request(app)
      .post("/auth/signup")
      .send({
        email: "test@example.com",
        password: "Password123",
        name: "Test User",
      })
      .expect(httpStatus.CREATED);

    expect(res.body).to.have.property("accessToken", "fakeAccessToken");
    expect(res.body).to.have.property("refreshToken", "fakeRefreshToken");
    expect(res.body).to.have.property(
      "message",
      "Account created successfully"
    );
  });

  it("should return 409 if the user already exists", async () => {
    userFindOneStub.resolves({ email: "test@example.com" }); // Simulate existing user

    const res = await request(app)
      .post("/auth/signup")
      .send({
        email: "test@example.com",
        password: "Password123",
        name: "Test User",
      })
      .expect(httpStatus.CONFLICT);

    expect(res.body).to.have.property("message", "User already exists");
  });

  it("should return 406 if validation fails", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ email: "invalid-email", password: "123", name: "" }) // Invalid input
      .expect(httpStatus.NOT_ACCEPTABLE);

    expect(res.body).to.have.property("message", "Please enter valid details");
    expect(res.body).to.have.property("error");
  });

  it("should return 500 if there is an internal server error", async () => {
    userFindOneStub.throws(new Error("Database error"));

    const res = await request(app)
      .post("/auth/signup")
      .send({
        email: "test@example.com",
        password: "Password123",
        name: "Test User",
      })
      .expect(httpStatus.INTERNAL_SERVER_ERROR);

    expect(res.body).to.have.property("message", "Error Adding to database");
  });
});
