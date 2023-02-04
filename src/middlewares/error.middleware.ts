import { Request, Response, NextFunction } from "express";
import { ILoggerService } from "../services/interfaces/logger.interface";

export const errorMiddleware = (loggerService: ILoggerService) => {
  return (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    loggerService.error(error);
    response.statusCode = 500;
    response.send(error.message);
  };
};
