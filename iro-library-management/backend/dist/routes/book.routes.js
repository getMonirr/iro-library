"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const book_controller_1 = require("../controllers/book.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const createBookValidation = [
    (0, express_validator_1.body)("title")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Title is required and must be between 1 and 200 characters"),
    (0, express_validator_1.body)("authors")
        .isArray({ min: 1 })
        .withMessage("At least one author is required"),
    (0, express_validator_1.body)("authors.*")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Author name cannot be empty"),
    (0, express_validator_1.body)("categories")
        .isArray({ min: 1 })
        .withMessage("At least one category is required"),
    (0, express_validator_1.body)("language")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage("Language cannot be empty"),
    (0, express_validator_1.body)("totalCopies")
        .isInt({ min: 1 })
        .withMessage("Total copies must be at least 1"),
    (0, express_validator_1.body)("availableCopies")
        .isInt({ min: 0 })
        .withMessage("Available copies cannot be negative"),
    (0, express_validator_1.body)("format")
        .isIn(["physical", "digital", "both"])
        .withMessage("Format must be physical, digital, or both"),
    (0, express_validator_1.body)("location.shelf")
        .if((0, express_validator_1.body)("format").isIn(["physical", "both"]))
        .notEmpty()
        .withMessage("Shelf is required for physical books"),
    (0, express_validator_1.body)("location.section")
        .if((0, express_validator_1.body)("format").isIn(["physical", "both"]))
        .notEmpty()
        .withMessage("Section is required for physical books"),
];
const updateBookValidation = [
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Title must be between 1 and 200 characters"),
    (0, express_validator_1.body)("authors")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one author is required"),
    (0, express_validator_1.body)("totalCopies")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Total copies must be at least 1"),
    (0, express_validator_1.body)("availableCopies")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Available copies cannot be negative"),
];
router.get("/search", book_controller_1.searchBooks);
router.get("/featured", book_controller_1.getFeaturedBooks);
router.get("/popular", book_controller_1.getPopularBooks);
router.get("/categories", book_controller_1.getBookCategories);
router.get("/form-data", book_controller_1.getBookFormData);
router.get("/", auth_1.optionalAuth, book_controller_1.getAllBooks);
router.get("/:id", auth_1.optionalAuth, book_controller_1.getBook);
router.use(auth_1.authenticate);
router.post("/", (0, auth_1.authorize)("admin", "librarian"), createBookValidation, book_controller_1.createBook);
router.patch("/:id", (0, auth_1.authorize)("admin", "librarian"), updateBookValidation, book_controller_1.updateBook);
router.delete("/:id", (0, auth_1.authorize)("admin", "librarian"), book_controller_1.deleteBook);
exports.default = router;
//# sourceMappingURL=book.routes.js.map