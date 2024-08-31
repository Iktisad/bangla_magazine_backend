import request from "supertest";
describe("Tag Module E2E Tests", () => {
    let tagId;
    describe("POST: api/tags", () => {
        it("should create a new tag", async () => {
            const res = await request(global.app)
                .post("/api/tags")
                .send({ name: "test-tag" });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.name).toBe("test-tag");
            tagId = res.body._id; // Save the tag ID for later use
        });
    });
    describe("GET: api/tags", () => {
        it("should get all tags", async () => {
            const res = await request(global.app).get("/api/tags");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe("test-tag");
        });
    });

    describe("GET: api/tags/:id", () => {
        it("should get a tag by ID", async () => {
            const res = await request(global.app).get(`/api/tags/${tagId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.name).toBe("test-tag");
        });
    });
    describe("PUT: api/tags/:id", () => {
        it("should update a tag by ID", async () => {
            const res = await request(global.app)
                .put(`/api/tags/${tagId}`)
                .send({ name: "updated-tag" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.name).toBe("updated-tag");
        });
    });

    describe("DELETE: api/tags/:id", () => {
        it("should delete a tag by ID", async () => {
            const res = await request(global.app).delete(`/api/tags/${tagId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty(
                "message",
                "Tag deleted successfully"
            );

            const getRes = await request(global.app).get(`/api/tags/${tagId}`);
            expect(getRes.status).toBe(404);
            expect(getRes.body).toHaveProperty("error", "Tag not found");
        });
    });
});
