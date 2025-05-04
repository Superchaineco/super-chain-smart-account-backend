import { NextFunction, Request, Response } from "express";
import axios, { AxiosRequestConfig, AxiosResponseHeaders } from "axios";
import { RPC_PROVIDER } from "@/config/superChain/constants";
import https from "https";

export function verifyInternalRequest(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = [
    "scsa-backend-production.up.railway.app",
    "scsa-backend-staging.up.railway.app",
    ...(process.env.NODE_ENV === "development" ? [
      "localhost:3003",
      "localhost:3000"
    ] : [])
  ];

  const origin = req.get("origin") || req.get("referer") || "";
  const host = req.get("host") || "";

  if (allowedOrigins.some(o => origin.startsWith(o)) || allowedOrigins.some(o => host.startsWith(o))) {
    return next();
  }

  console.warn(`⛔ Blocked: origin=${origin} host=${host}`);
  return res.status(403).json({ error: "Forbidden: invalid origin" });
}

export async function rpcReverseProxy(req: Request, res: Response) {
  try {

    const method = req.method.toLowerCase() as AxiosRequestConfig["method"];

    console.log("🆕🆕🆕🆕🆕🆕🆕🆕🆕");
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log(`→ IP: ${req.ip}`);
    console.log(`→ Body:`, req.body);
    delete req.headers.host

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers[key] = value;
    }

    const agent = new https.Agent({ rejectUnauthorized: false });

    const config: AxiosRequestConfig = {
      method,
      url: RPC_PROVIDER,
      headers,
      data: req.body,
      params: req.query,
      responseType: "json",
      httpsAgent: agent,
    };

    const response = await axios(config);


    
    const forbiddenHeaders = ["content-length", "transfer-encoding", "connection"];

    for (const [key, value] of Object.entries(response.headers)) {
      if (value && !forbiddenHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, value.toString());
      }
    }


    res.status(response.status);
   

    if (typeof (response.data as any)?.pipe === "function") {
      (response.data as any).pipe(res);
    } else {
      res.send(response.data);
    }
  } catch (error: any) {
    console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
    console.error("Proxy error:", error?.message || error);
    console.log(req.headers);
    console.log(req.body);
    console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");


    if (error.response) {
      res.status(error.response.status).send(error?.message);
    } else {
      res.status(500).json({ error: error?.message || "Internal Proxy Error" });
    }
  }
}

