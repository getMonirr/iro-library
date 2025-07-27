"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const adminAuth_1 = require("../middleware/adminAuth");
const auth_1 = require("../middleware/auth");
const category_validator_1 = require("../validators/category.validator");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, category_controller_1.getAllCategories);
router.get("/active", auth_1.authenticate, category_controller_1.getActiveCategories);
router.get("/:id", auth_1.authenticate, category_controller_1.getCategory);
router.post("/", auth_1.authenticate, adminAuth_1.adminAuth, category_validator_1.validateCategory, category_controller_1.createCategory);
router.patch("/:id", auth_1.authenticate, adminAuth_1.adminAuth, category_validator_1.validateCategoryUpdate, category_controller_1.updateCategory);
router.delete("/:id", auth_1.authenticate, adminAuth_1.adminAuth, category_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map