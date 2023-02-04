import pino from "pino";
import { Request, Response, NextFunction } from "express";
import { ILoggerService } from "../services/interfaces/logger.interface";

//const pinoMiddleware = expressPinoLogger.pinoHttp();

// export const loggerMiddleware = () => {
//   return (request: Request, response: Response, next: NextFunction) => {
//     return pinoMiddleware(request, response, next);
//   };
// };

export const loggerMiddleware = (loggerService: ILoggerService) => {
  return (request: Request, response: Response, next: NextFunction) => {
    //return pinoMiddleware(request, response, next);
    loggerService.info(request);
    next();
  };
};
