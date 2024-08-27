import bcrypt from "bcrypt";
import { User } from "../src/users/user.model.js";

export default async function seedUsers() {
    const users = [
        {
            username: "adminUser",
            email: "admin@gmail.com",
            password: await bcrypt.hash("admin123", 10),
            dob: new Date("1980-01-01"),
            role: "admin",
            profile: {
                firstName: "Admin",
                lastName: "User",
                bio: "Administrator of the system",
                contactEmail: ["admin@example.com"],
                socialLinks: {
                    linkedin: "https://linkedin.com/admin",
                    twitter: "https://twitter.com/admin",
                },
            },
            isActive: true,
            verificationToken: null,
            resetPasswordToken: null,
        },
        {
            username: "editorUser",
            email: "editor@example.com",
            password: await bcrypt.hash("editor123", 10),
            dob: new Date("1990-01-01"),
            role: "editor",
            profile: {
                firstName: "Editor",
                lastName: "User",
                bio: "Editor of the system",
                contactEmail: ["editor@example.com"],
                socialLinks: {
                    linkedin: "https://linkedin.com/editor",
                    twitter: "https://twitter.com/editor",
                },
            },
            isActive: true,
            verificationToken: null,
            resetPasswordToken: null,
        },
        {
            username: "contributorUser",
            email: "contributor@example.com",
            password: await bcrypt.hash("contributor123", 10),
            dob: new Date("2000-01-01"),
            role: "contributor",
            profile: {
                firstName: "Contributor",
                lastName: "User",
                bio: "Contributor to the system",
                contactEmail: ["contributor@example.com"],
                socialLinks: {
                    linkedin: "https://linkedin.com/contributor",
                    twitter: "https://twitter.com/contributor",
                },
            },
            isActive: true,
            verificationToken: null,
            resetPasswordToken: null,
        },
        {
            username: "randomUser",
            email: "random@example.com",
            password: await bcrypt.hash("random123", 10),
            dob: new Date("2000-01-01"),
            role: "contributor",
            profile: {
                firstName: "Random",
                lastName: "User",
                bio: "Contributor to the system",
                contactEmail: ["random@example.com"],
                socialLinks: {
                    linkedin: "https://linkedin.com/contributor",
                    twitter: "https://twitter.com/contributor",
                },
            },
            isActive: false,
            verificationToken: null,
            resetPasswordToken: null,
        },
    ];

    try {
        await User.insertMany(users);
        // const list = await User.find({}).lean();
        // console.log(list);
        console.log("Users seeded successfully!");
    } catch (err) {
        console.error("Error seeding users:", err);
    }
}
