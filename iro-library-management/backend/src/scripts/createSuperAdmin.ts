import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User";

// Load environment variables
dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/iro-library";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      $or: [{ email: "superadmin@iro.com" }, { role: "super_admin" }],
    });

    if (existingSuperAdmin) {
      console.log("Super admin already exists:");
      console.log(`Email: ${existingSuperAdmin.email}`);
      console.log(`Role: ${existingSuperAdmin.role}`);
      console.log(`Active: ${existingSuperAdmin.isActive}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("superadmin123", 12);

    // Create super admin
    const superAdmin = await User.create({
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
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run if this file is executed directly
if (require.main === module) {
  createSuperAdmin();
}

export default createSuperAdmin;
