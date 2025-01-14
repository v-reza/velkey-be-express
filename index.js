/* Import Module */
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");
const request = require("request");
const { Server } = require("socket.io");
const fs = require("fs");

/* Load Router  */
const authRouter = require("./router/auth");
const postsRouter = require("./router/posts");
const usersRouter = require("./router/users");
const userProfileRouter = require("./router/userprofile");
const imagesRouter = require("./router/images");
const jobsRouter = require("./router/jobs");
const companyRouter = require("./router/company");
const commentRouter = require("./router/comments");
const skillsRouter = require("./router/skills");
const educationsRouter = require("./router/educations");
const conversationsRouter = require("./router/conversations");
const messagesRouter = require("./router/messages");
const notificationsRouter = require("./router/notifications");
const locationsRouter = require("./router/locations");
const cronJobs = require("./cron");
const verifyBearerToken = require("./helper/verifyBearerToken");

/* Connect Env */
dotenv.config();

/**
 * Connect MongoDB
 */
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("connect mongodb bos"))
  .catch((err) => console.log(err));

/* App use module */
app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/assets")));

/* Use Router */
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/userprofile", userProfileRouter);
app.use("/api/images", imagesRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/company", companyRouter);
app.use("/api/comments", commentRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/educations", educationsRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/locations", locationsRouter);

const options = {
  method: "POST",
  url: "https://auth.emsicloud.com/connect/token",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  form: {
    client_id: "980nnwk4cnlxk6u4",
    client_secret: "imo3ndvA",
    grant_type: "client_credentials",
    scope: "emsi_open",
  },
};
app.get("/checkEmsiToken", (req, res) => {
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    response.body = JSON.parse(body);
    res.send(response.body);
  });
});

/* Check Token */
app.get("/api/checkToken", verifyBearerToken, (req, res) => {
  res.status(200).json(req.user);
});

/* Cron jobs hapus file tidak dipakai */
cronJobs.scheduled.start()

/* Set Port */
const port = process.env.PORT || 1000;

app.get("/", (req, res) => {
  res.send("👋 WeavLink API Running 👋 to https://weavlink.works");
});

/* Listen Application */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
