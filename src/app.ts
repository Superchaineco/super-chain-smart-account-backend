import express from "express";
import Session from 'express-session';
import cors from "cors";
import morgan from "morgan";

import * as middleware from "./utils/middleware";
import router from "./routes/router";
import authRouter from "./routes/auth";
import { DOMAIN, ENV, ENVIRONMENTS } from "./config/superChain/constants";

const app = express();
console.debug("ENV", ENV);


app.use(cors({
  origin: DOMAIN,
  credentials: true,
}));

app.use(express.json());
app.use(Session({
  name: 'siwe-quickstart',
  secret: "siwe-quickstart-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: ENV === ENVIRONMENTS.production,  sameSite: true }
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