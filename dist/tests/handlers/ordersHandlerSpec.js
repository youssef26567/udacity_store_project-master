"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe("Suite for orders endpoints:", () => {
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
    it("create order: POST orders/create", async () => {
        //create a user to create an order
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const { accessToken, id } = response1.body;
        const response = await (0, supertest_1.default)(server_1.default)
            .post("/orders/create")
            .set("authorization", `Bearer ${accessToken}`);
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual("active");
        expect(response.body.userid).toEqual(id);
    });
    it("get order for a user: GET /orders/get-orders-for-user", async () => {
        //create a user to create an order
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const { accessToken, id } = response1.body;
        const responseOrder = await (0, supertest_1.default)(server_1.default)
            .post("/orders/create")
            .set("authorization", `Bearer ${accessToken}`);
        const response = await (0, supertest_1.default)(server_1.default)
            .get("/orders/get-orders-for-user")
            .set("authorization", `Bearer ${accessToken}`);
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined();
        expect(response.body[0].userid).toEqual(id);
    });
    it("[extra] set status of an order: POST /orders/set-status", async () => {
        //create a user to create an order
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const { accessToken, id } = response1.body;
        const responseOrder = await (0, supertest_1.default)(server_1.default)
            .post("/orders/create")
            .set("authorization", `Bearer ${accessToken}`);
        const response = await (0, supertest_1.default)(server_1.default)
            .post("/orders/set-status")
            .set("authorization", `Bearer ${accessToken}`)
            .send({ orderId: responseOrder.body.id, status: "complete" });
        // console.log('response body', response.body)
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined();
    });
    it("[optional] get complete orders: GET /orders/complete", async () => {
        //create a user to create an order
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const { accessToken, id } = response1.body;
        const responseOrder = await (0, supertest_1.default)(server_1.default)
            .post("/orders/create")
            .set("authorization", `Bearer ${accessToken}`);
        await (0, supertest_1.default)(server_1.default)
            .post("/orders/set-status")
            .set("authorization", `Bearer ${accessToken}`)
            .send({ orderId: responseOrder.body.id, status: "complete" });
        const response = await (0, supertest_1.default)(server_1.default)
            .get("/orders/complete")
            .set("authorization", `Bearer ${accessToken}`);
        expect(response.status).toEqual(200);
        expect(response.body[0].status).toEqual('complete');
        expect(response.body[0].userid).toEqual(id);
    });
    it("Add product to order: POST /orders/addproduct", async () => {
        //create a user to create an order
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const { accessToken, id } = response1.body;
        const responseOrder = await (0, supertest_1.default)(server_1.default)
            .post("/orders/create")
            .set("authorization", `Bearer ${accessToken}`);
        const responseProduct = await (0, supertest_1.default)(server_1.default)
            .post("/products/create")
            .set("authorization", `Bearer ${accessToken}`)
            .send(newProduct);
        // console.log({
        //     productId: (product as Product).id,
        //     orderId: (order as Order).id,
        //     quantity: 2,
        //   })
        const response = await (0, supertest_1.default)(server_1.default)
            .post("/orders/addproduct")
            .set("authorization", `Bearer ${accessToken}`)
            .send({
            productId: responseProduct.body.id,
            orderId: responseOrder.body.id,
            quantity: 2,
        });
        // console.log(response.body)
        expect(response.status).toEqual(200);
        expect(response.body.orderid).toEqual(responseOrder.body.id);
        expect(response.body.productid).toEqual(responseProduct.body.id);
        expect(response.body.quantity).toEqual(2);
    });
});
