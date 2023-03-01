import client from "../../db/db";
import request from "supertest";
import app from "../../server";
import { createToken } from "../../utilities/authentication";

describe("Suite for products endpoints:", (): void => {
  // beforeAll(() => {
  //   client.connect();
  // });

  const newProduct = {
    name: "ball",
    price: 100,
    category: "play",
  };
  const newUser = {
    firstname: "ahmed",
    lastname: "hisham",
    password: "password123",
  };

  it("create product: POST products/create", async (): Promise<void> => {
    const responseUser = await request(app).post("/users/signup").send(newUser);
    const { accessToken } = responseUser.body
    const response = await request(app)
      .post("/products/create")
      .set("authorization", `Bearer ${accessToken}`)
      .send(newProduct);
    expect(response.status).toEqual(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('ball');
    expect(response.body.category).toEqual('play');
  });

  // it("create product: POST products/create", async (): Promise<void> => {
  //   const responseUser = await request(app).post("/users/signup").send(newUser);
  //   const { accessToken } = responseUser.body
  //   const response = await request(app)
  //     .post("/products/create")
  //     .set("authorization", `Bearer ${accessToken}`)
  //     .send(newProduct);
  //   expect(response.status).toEqual(200);
  //   expect(response.body.id).toBeDefined();
  // });

  it("All products: GET /products/index", async (): Promise<void> => {
    //to make this test independent from the above test
    const response = await request(app).get("/products/index");
    // console.log(response.body)
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });

  it("Get one product: GET /products/show/:productId", async (): Promise<void> => {
    //we need a token to create the product, then we could test show product with the id created
    const responseUser = await request(app).post("/users/signup").send(newUser);
    const { accessToken } = responseUser.body
    const responseProduct = await request(app)
      .post("/products/create")
      .set("authorization", `Bearer ${accessToken}`)
      .send(newProduct);
    const responseShow = await request(app).get(
      `/products/show/${responseProduct.body.id}`
    );
    // console.log(response.body)
    expect(responseShow.status).toEqual(200);
    expect(responseShow.body.id).toEqual(responseProduct.body.id);
    expect(responseShow.body.name).toEqual(responseProduct.body.name);
  });

  it("Get one product by category: GET /products/categories/:category", async (): Promise<void> => {
    //we need a token to create the product, then we could test show product with the id created
    const responseUser = await request(app).post("/users/signup").send(newUser);
    const { accessToken } = responseUser.body
    const responseProduct = await request(app)
      .post("/products/create")
      .set("authorization", `Bearer ${accessToken}`)
      .send(newProduct);
    const responseCategory = await request(app).get(
      `/products/categories/${responseProduct.body.category}`
    );
    // console.log('responseCategory', responseCategory)
    // console.log(response.body)
    expect(responseCategory.status).toEqual(200);
    expect(responseCategory.body).toBeDefined();
    expect(responseCategory.body[0].category).toEqual(responseProduct.body.category)
  });

  });
