"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publisher_controller_1 = require("../controllers/publisher.controller");
const adminAuth_1 = require("../middleware/adminAuth");
const auth_1 = require("../middleware/auth");
const publisher_validator_1 = require("../validators/publisher.validator");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, publisher_controller_1.getAllPublishers);
router.get("/active", auth_1.authenticate, publisher_controller_1.getActivePublishers);
router.get("/:id", auth_1.authenticate, publisher_controller_1.getPublisher);
router.post("/", auth_1.authenticate, adminAuth_1.adminAuth, publisher_validator_1.validatePublisher, publisher_controller_1.createPublisher);
router.patch("/:id", auth_1.authenticate, adminAuth_1.adminAuth, publisher_validator_1.validatePublisherUpdate, publisher_controller_1.updatePublisher);
router.delete("/:id", auth_1.authenticate, adminAuth_1.adminAuth, publisher_controller_1.deletePublisher);
exports.default = router;
//# sourceMappingURL=publisher.routes.js.map