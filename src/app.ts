import express from "express";
import Session from 'express-session';
import cors from "cors";
import morgan from "morgan";

import * as middleware from "./utils/middleware";
import router from "./routes/router";
import authRouter from "./routes/auth";

const app = express();


app.use(express.json());

app.use(cors({
  credentials: true,
}));
app.use(Session({
  name: 'siwe-quickstart',
  secret: "siwe-quickstart-secret",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: true }
}));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

app.use("/api", router);
app.use('/auth', authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;