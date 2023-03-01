"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe("Suite for users endpoints:", () => {
    // beforeAll(() => {
    //   client.connect();
    // });
    const newUser = {
        firstname: "ahmed",
        lastname: "hisham",
        password: "password123",
    };
    it("create user: POST users/signup", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        expect(response.status).toEqual(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.firstname).toEqual('ahmed');
    });
    it("User login: POST users/login", async () => {
        //to make this test independent from the above test
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const userLoginData = {
            userId: response1.body.id,
            password: "password123",
        };
        const response = await (0, supertest_1.default)(server_1.default)
            .post("/users/login")
            .send(userLoginData);
        // console.log(response.body)
        expect(response.status).toEqual(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.id).toEqual(response1.body.id);
    });
    it("All users: GET users/index", async () => {
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const { accessToken, id } = response1.body;
        const response = await (0, supertest_1.default)(server_1.default)
            .get("/users/index")
            .set("authorization", `Bearer ${accessToken}`);
        // console.log(response.body)
        expect(response.status).toEqual(200);
        expect(response.body[0]).toBeDefined();
        expect(response.body[0].id).toBeDefined();
    });
    it("get one user: GET users/show/:userId", async () => {
        const response1 = await (0, supertest_1.default)(server_1.default).post("/users/signup").send(newUser);
        const { accessToken, id } = response1.body;
        const response = await (0, supertest_1.default)(server_1.default)
            .get(`/users/show/${id}`)
            .set("authorization", `Bearer ${accessToken}`);
        // console.log(response.body)
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined();
        expect(response.body.id).toEqual(id);
        expect(response.body.firstname).toEqual('ahmed');
    });
});
