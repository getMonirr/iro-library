"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const author_controller_1 = require("../controllers/author.controller");
const adminAuth_1 = require("../middleware/adminAuth");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", author_controller_1.getAllAuthors);
router.get("/select", author_controller_1.getAuthorsForSelect);
router.get("/:id", author_controller_1.getAuthor);
router.use(auth_1.authenticate);
router.use(adminAuth_1.adminAuth);
router.post("/", author_controller_1.createAuthor);
router.patch("/:id", author_controller_1.updateAuthor);
router.delete("/:id", author_controller_1.deleteAuthor);
exports.default = router;
//# sourceMappingURL=author.routes.js.map