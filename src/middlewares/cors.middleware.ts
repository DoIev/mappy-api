import cors from "cors";
import { Request, Response, NextFunction } from "express";

const corsDefaultMiddleware = cors();

export const corsMiddleWare = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    return corsDefaultMiddleware(request, response, next);
  };
};
