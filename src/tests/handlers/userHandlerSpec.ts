import request from "supertest";
import app from "../../server";
import { createToken } from "../../utilities/authentication";

describe("Suite for users endpoints:", (): void => {
  // beforeAll(() => {
  //   client.connect();
  // });
  const newUser = {
    firstname: "ahmed",
    lastname: "hisham",
    password: "password123",
  };

  it("create user: POST users/signup", async (): Promise<void> => {
    const response = await request(app).post("/users/signup").send(newUser);
    expect(response.status).toEqual(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.firstname).toEqual('ahmed');
  });

  it("User login: POST users/login", async (): Promise<void> => {
    //to make this test independent from the above test
    const response1 = await request(app).post("/users/signup").send(newUser);
    const userLoginData = {
      userId: response1.body.id,
      password: "password123",
    };
    const response = await request(app)
      .post("/users/login")
      .send(userLoginData);
    // console.log(response.body)
    expect(response.status).toEqual(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.id).toEqual(response1.body.id);
  });

  it("All users: GET users/index", async (): Promise<void> => {
    const response1 = await request(app).post("/users/signup").send(newUser);
    const {  accessToken, id } = response1.body
    const response = await request(app)
      .get("/users/index")
      .set("authorization", `Bearer ${accessToken}`);
    // console.log(response.body)
    expect(response.status).toEqual(200);
    expect(response.body[0]).toBeDefined();
    expect(response.body[0].id).toBeDefined();
  });

  it("get one user: GET users/show/:userId", async (): Promise<void> => {
    const response1 = await request(app).post("/users/signup").send(newUser);
    const { accessToken, id} = response1.body
    const response = await request(app)
      .get(`/users/show/${id}`)
      .set("authorization", `Bearer ${accessToken}`);
    // console.log(response.body)
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toEqual(id);
    expect(response.body.firstname).toEqual('ahmed');
  });
});
