"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request_controller_1 = require("../controllers/request.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/GetTickets", (req, res, next) => (0, auth_middleware_1.authMiddleware)(req, res, next), request_controller_1.getTicketsController);
exports.default = router;
