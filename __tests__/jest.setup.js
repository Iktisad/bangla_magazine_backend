// jest.setup.js

beforeAll(async () => {
    // The mock connection is automatically handled
});

afterAll(async () => {
    // await mongoose.connection.close(); // Close the mock connection after tests
});

describe("This is test setup environment", () => {
    test.todo("Will do something soon");
});
