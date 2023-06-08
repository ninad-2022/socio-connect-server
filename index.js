import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import PostRoutes from "./Routes/PostRoutes.js";
import UploadRoutes from "./Routes/UploadRoute.js";
const app = express();

//Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "30mb",
    extended: true,
  })
);

// to server images for public
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(cors());

dotenv.config();
const port = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(port, () => console.log(`Listening on port ${port}`)));
app.listen;
``;

//Usages of routes
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/posts", PostRoutes);
app.use("/upload", UploadRoutes);
