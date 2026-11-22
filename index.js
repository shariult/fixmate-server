import dotEnv from "dotenv";
if (process.env.NODE_ENV === "dev") {
  dotEnv.config();
}
const PORT = process.env.PORT || 5000;

//=== imports ===//
import express from "express";
const app = express();
import cors from "cors";

//=== configuration ===//

app.use(express.json());
app.use(cors());

//=== custom imports ===//
import { ExpressError } from "./utils/errorHandler.js";
import indexRoutes from "./routes/indexRouter.js";
import serviceRoutes from "./routes/serviceRouter.js";
import bookingRoute from "./routes/BookingRouter.js";
import userRoutes from "./routes/userRouter.js";

//=== routes ===//

app.use("/", indexRoutes);
app.use("/service", serviceRoutes);
app.use("/booking", bookingRoute);
app.use("/user", userRoutes);

//=== error handler ===//

app.all("*splat", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send({ statusCode, message, stack: err.stack });
});

//=== server ===//

app.listen(PORT, () => {
  console.log(`Server Running on Port: ${PORT}`);
});
