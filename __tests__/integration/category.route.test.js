import request from "supertest";
import mongoose from "mongoose";
import App from "../../src/app.js"; // Assuming your Express app is exported from app.js or index.js
import { Category } from "../../src/magazine/category/category.model.js";
let app;
beforeAll(() => {
    app = new App().app;
});
describe("Category E2E Tests", () => {
    describe("POST api/category", () => {
        it("should create a new category", async () => {
            const categoryData = { category: ["Electronics"] };
            const response = await request(app)
                .post("/api/category")
                .send(categoryData);

            expect(response.body.newCategories[0].name).toBe("Electronics");
            expect(response.status).toBe(201);
        });

        it("should not create a duplicate category", async () => {
            const categoryData = { category: ["Electronics"] };
            const response = await request(app)
                .post("/api/category")
                .send(categoryData)
                .expect(409);

            expect(response.body.error).toBe(
                "No new categories were created. Existing categories: Electronics"
            );
        });
    });

    describe("GET /category", () => {
        it("should retrieve all categories", async () => {
            const response = await request(app)
                .get("/api/category")
                .expect(200);

            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("name");
        });
    });

    describe("GET /category/:id", () => {
        it("should retrieve a category by ID", async () => {
            const category = await Category.create({ name: "Books" });
            const response = await request(app)
                .get(`/api/category/${category._id}`)
                .expect(200);

            expect(response.body.name).toBe("Books");
        });

        it("should return 404 if category not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/category/${fakeId}`)
                .expect(404);

            expect(response.body.error).toBe("Category not found");
        });
    });

    describe("PUT /category/:id", () => {
        it("should update a category by ID", async () => {
            const category = new Category({ name: "Home" });
            await category.save();

            const response = await request(app)
                .put(`/api/category/${category._id}`)
                .send({ category: { name: "Home Improvement" } })
                .expect(200);

            expect(response.body.name).toBe("Home Improvement");
        });

        it("should return 404 if category not found for update", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/api/category/${fakeId}`)
                .send({ category: { name: "Nonexistent" } })
                .expect(404);

            expect(response.body.error).toBe("Category not found");
        });
    });

    describe("DELETE /category/:id", () => {
        it("should delete a category by ID", async () => {
            const category = new Category({ name: "Garden" });
            await category.save();

            const response = await request(app)
                .delete(`/api/category/${category._id}`)
                .expect(200);

            expect(response.body.message).toBe("Category deleted successfully");
        });

        it("should return 404 if category not found for deletion", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/category/${fakeId}`)
                .expect(404);

            expect(response.body.error).toBe("Category not found");
        });
    });
});
