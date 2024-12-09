"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const timetable_controller_1 = require("../controllers/timetable.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/PostTimeTable", auth_middleware_1.authMiddleware, timetable_controller_1.postTimeTableController);
exports.default = router;
