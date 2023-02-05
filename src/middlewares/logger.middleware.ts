import { Request, Response, NextFunction } from "express";
import { ILoggerService } from "../services/interfaces/logger.interface";

export const loggerMiddleware = (loggerService: ILoggerService) => {
  return (request: Request, response: Response, next: NextFunction) => {
    loggerService.info(request);
    next();
  };
};
