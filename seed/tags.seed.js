import mongoose from "mongoose";
import { Tag } from "../src/magazine/tag/tag.model.js"; // Adjust path to your Tag model

const seedTags = [
    { name: "Technology" },
    { name: "Health" },
    { name: "Travel" },
    { name: "Education" },
    { name: "Science" },
];

export default async function seedtags() {
    try {
        mongoose.connect(global.__MONGOD__.getUri());
        await Tag.insertMany(seedTags);
        console.log("Tags seeded successfully");
    } catch (error) {
        console.error("Error seeding tags: ", error);
    }
}
