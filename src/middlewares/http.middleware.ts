import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";

const bodyParserMiddleware = bodyParser.json();

export const httpJsonParserMiddleware = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    return bodyParserMiddleware(request, response, next);
  };
};
