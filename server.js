import express from "express";
import cors from "cors";
import "dotenv/config";
import healthRoutes from "./routes/health.route.js";
import { connectDB } from "./configs/db.js";

import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.controller.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/clerk", clerkWebhooks);
app.use("/", healthRoutes);

//User
app.use("/api/v1/user", clerkMiddleware(), userRouter);

//ENDPOINTS FOR ADMIN USAGE
app.use("/api/v1/users", clerkMiddleware(), adminRouter);

//dev enviroment

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
// export default app;
