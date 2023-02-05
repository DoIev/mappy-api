import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { httpJsonParserMiddleware } from "./middlewares/http.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { corsMiddleWare } from "./middlewares/cors.middleware";
import { bootstrap } from "./bootstrapper";
async function main() {
  const {
    configurationService,
    entitiesController,
    loggerService,
    templatesController,
  } = await bootstrap();

  const app: express.Application = express();
  const port: number = parseInt(configurationService.get("PORT"));

  app.use(corsMiddleWare());
  app.use(httpJsonParserMiddleware());
  app.use(loggerMiddleware(loggerService));

  app.get("/", (req, res) => {
    res.send("Alive");
  });

  app.get("/templates", async (request, response, next) => {
    try {
      await templatesController.getAllTemplates(request, response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/templates/:templateId", async (request, response, next) => {
    try {
      await templatesController.getTemplateById(request, response);
    } catch (error) {
      next(error);
    }
  });

  app.post("/templates", async (request, response, next) => {
    try {
      await templatesController.createTemplate(request, response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/entities", async (request, response, next) => {
    try {
      await entitiesController.getEntities(request, response);
    } catch (error) {
      next(error);
    }
  });

  app.post("/entities", async (request, response, next) => {
    try {
      await entitiesController.createEntity(request, response);
    } catch (error) {
      next(error);
    }
  });

  app.put("/entities", async (request, response, next) => {
    try {
      await entitiesController.updateEntity(request, response);
    } catch (error) {
      next(error);
    }
  });

  app.use(errorMiddleware(loggerService));
  app.listen(port);
}

main();
