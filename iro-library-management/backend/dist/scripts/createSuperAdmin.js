"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const createSuperAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/iro-library";
        await mongoose_1.default.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        const existingSuperAdmin = await User_1.default.findOne({
            $or: [{ email: "superadmin@iro.com" }, { role: "super_admin" }],
        });
        if (existingSuperAdmin) {
            console.log("Super admin already exists:");
            console.log(`Email: ${existingSuperAdmin.email}`);
            console.log(`Role: ${existingSuperAdmin.role}`);
            console.log(`Active: ${existingSuperAdmin.isActive}`);
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash("superadmin123", 12);
        const superAdmin = await User_1.default.create({
            firstName: "Super",
            lastName: "Admin",
            email: "superadmin@iro.com",
            phone: "+1234567890",
            password: hashedPassword,
            role: "super_admin",
            isActive: true,
            membershipStatus: "active",
            isFirstLogin: false,
            mustChangePassword: false,
        });
        console.log("✅ Super admin created successfully!");
        console.log(`📧 Email: ${superAdmin.email}`);
        console.log(`🔑 Password: superadmin123`);
        console.log(`👑 Role: ${superAdmin.role}`);
        console.log(`🆔 ID: ${superAdmin._id}`);
    }
    catch (error) {
        console.error("❌ Error creating super admin:", error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
};
if (require.main === module) {
    createSuperAdmin();
}
exports.default = createSuperAdmin;
//# sourceMappingURL=createSuperAdmin.js.map