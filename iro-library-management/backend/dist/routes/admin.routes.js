"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)("admin"));
router.get("/dashboard", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Admin dashboard endpoint",
    });
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map