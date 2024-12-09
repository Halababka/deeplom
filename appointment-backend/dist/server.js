"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const request_routes_1 = __importDefault(require("./routes/request.routes"));
const timetable_routes_1 = __importDefault(require("./routes/timetable.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Маршруты
app.use("/api/requests", request_routes_1.default);
app.use("/api/timetable", timetable_routes_1.default);
app.use("/api/booking", booking_routes_1.default);
app.use((req, res, next) => {
    res.status(404).json({ error: 'Resource not found' });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
