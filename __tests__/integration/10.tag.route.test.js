import request from "supertest";
import App from "../../src/app.js";
import seedtags from "../../seed/tags.seed.js";
let tagId;
let app;
beforeAll(async () => {
    app = new App().app;
    await seedtags();
});

describe("Tag E2E Tests", () => {
    describe("POST: api/tags", () => {
        it("should create a new tag", async () => {
            const res = await request(app)
                .post("/api/tags")
                .send({ hashtags: ["test-tag"] });
            expect(res.status).toBe(201);
            expect(res.body.newTags[0]).toHaveProperty("_id");
            expect(res.body.newTags[0].name).toBe("#TestTag");
            tagId = res.body.newTags[0]._id; // Save the tag ID for later use
        });
    });
    describe("GET: api/tags", () => {
        it("should get all tags", async () => {
            const res = await request(app).get("/api/tags");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            const hasTestTag = res.body.some((tag) => tag.name === "#TestTag");
            expect(hasTestTag).toBe(true);
        });
    });

    describe("GET: api/tags/:id", () => {
        it("should get a tag by ID", async () => {
            const res = await request(app).get(`/api/tags/${tagId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.name).toBe("#TestTag");
        });
    });
    describe("PUT: api/tags/:id", () => {
        it("should update a tag by ID", async () => {
            const res = await request(app)
                .put(`/api/tags/${tagId}`)
                .send({ name: "updated-tag" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.name).toBe("updated-tag");
        });
    });

    describe("DELETE: api/tags/:id", () => {
        it("should delete a tag by ID", async () => {
            const res = await request(app).delete(`/api/tags/${tagId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty(
                "message",
                "Tag deleted successfully"
            );

            const getRes = await request(app).get(`/api/tags/${tagId}`);
            expect(getRes.status).toBe(404);
            expect(getRes.body).toHaveProperty("error", "Tag not found");
        });
    });
});
