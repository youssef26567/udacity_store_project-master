import request from "supertest";
import app from "../../server";
import { createToken } from "../../utilities/authentication";
import { User, UserModel } from "../../models/userModel";
import { Product, ProductModel } from "../../models/productModel";
import { Order, OrderModel } from "../../models/orderModel";

describe("Suite for orders endpoints:", (): void => {
  const newProduct = {
    name: "ball",
    price: 100,
    category: "play",
  };
  const newUser = {
    firstname: "ahmed",
    lastname: "hisham",
    hash: "passwordHash",
  };

  //to make of orders shorter I will run them all in one spec
  it("create order: POST orders/create", async (): Promise<void> => {
    //create a user to create an order
    const response1 = await request(app).post("/users/signup").send(newUser);
    const { accessToken, id} = response1.body
    const response = await request(app)
      .post("/orders/create")
      .set("authorization", `Bearer ${accessToken}`)
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual("active");
    expect(response.body.userid).toEqual(id);
  });

  it("get order for a user: GET /orders/get-orders-for-user", async (): Promise<void> => {
    //create a user to create an order
    const response1 = await request(app).post("/users/signup").send(newUser);
    const { accessToken, id} = response1.body
    const responseOrder = await request(app)
      .post("/orders/create")
      .set("authorization", `Bearer ${accessToken}`)
    const response = await request(app)
      .get("/orders/get-orders-for-user")
      .set("authorization", `Bearer ${accessToken}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body[0].userid).toEqual(id);
  });

  it("[extra] set status of an order: POST /orders/set-status", async (): Promise<void> => {
    //create a user to create an order
    const response1 = await request(app).post("/users/signup").send(newUser);
    const { accessToken, id} = response1.body
    const responseOrder = await request(app)
      .post("/orders/create")
      .set("authorization", `Bearer ${accessToken}`)
    const response = await request(app)
      .post("/orders/set-status")
      .set("authorization", `Bearer ${accessToken}`)
      .send({ orderId: (responseOrder.body as Order).id, status: "complete" });
      // console.log('response body', response.body)
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });

  it("[optional] get complete orders: GET /orders/complete", async (): Promise<void> => {
    //create a user to create an order
    const response1 = await request(app).post("/users/signup").send(newUser);
    const { accessToken, id} = response1.body
    const responseOrder = await request(app)
      .post("/orders/create")
      .set("authorization", `Bearer ${accessToken}`)
    await request(app)
      .post("/orders/set-status")
      .set("authorization", `Bearer ${accessToken}`)
      .send({ orderId: (responseOrder.body as Order).id, status: "complete" });
    const response = await request(app)
      .get("/orders/complete")
      .set("authorization", `Bearer ${accessToken}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].status).toEqual('complete');
    expect(response.body[0].userid).toEqual(id);
  });

  it("Add product to order: POST /orders/addproduct", async (): Promise<void> => {
    //create a user to create an order
    const response1 = await request(app).post("/users/signup").send(newUser);
    const { accessToken, id} = response1.body
    const responseOrder = await request(app)
      .post("/orders/create")
      .set("authorization", `Bearer ${accessToken}`)
    const responseProduct = await request(app)
      .post("/products/create")
      .set("authorization", `Bearer ${accessToken}`)
      .send(newProduct);
    // console.log({
    //     productId: (product as Product).id,
    //     orderId: (order as Order).id,
    //     quantity: 2,
    //   })
    const response = await request(app)
      .post("/orders/addproduct")
      .set("authorization", `Bearer ${accessToken}`)
      .send({
        productId: (responseProduct.body as Product).id,
        orderId: (responseOrder.body as Order).id,
        quantity: 2,
      });
    // console.log(response.body)
    expect(response.status).toEqual(200);
    expect(response.body.orderid).toEqual((responseOrder.body as Order).id);
    expect(response.body.productid).toEqual((responseProduct.body as Order).id);
    expect(response.body.quantity).toEqual(2);
  });
});
