import express from "express";
import { ConfigurationService } from "./services/configuration.service";
import { IConfigurationService } from "./services/interfaces/configuration.interface";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { httpJsonParserMiddleware } from "./middlewares/http.middleware";
import { MongoRepository } from "./repositories/mongo.repository";
import { ILoggerService } from "./services/interfaces/logger.interface";
import { LoggerService } from "./services/logger.service";
import { TemplatesService } from "./services/templates.service";
import { ITemplate } from "./models/template.model";
import { TemplatesController } from "./controllers/templates.controller";
import { MetadataGenerator } from "./services/metadata.generator";
import { errorMiddleware } from "./middlewares/error.middleware";
import { TimeService } from "./services/time.service";
import { EntitiesController } from "./controllers/entity.controller";
import { EntitiesService } from "./services/entity.service";
import { IEntity } from "./models/entity.model";
import { EntitiesValidator } from "./services/entity.validator";
import { corsMiddleWare } from "./middlewares/cors.middleware";

async function main() {
  const timeService = new TimeService();
  const loggerService: ILoggerService = new LoggerService();
  const configurationService: IConfigurationService = new ConfigurationService(
    {}
  );
  configurationService.init();
  loggerService.init();

  const { entitiesCollectionName, templatesCollectionName } =
    configurationService.getAll();

  const connectionContext = {
    connectionString: configurationService.get("connectionString"),
    databaseName: configurationService.get("databaseName"),
  };

  const templatesRepository = new MongoRepository<ITemplate>({
    ...connectionContext,
    collectionName: templatesCollectionName,
  });
  const entitiesRepository = new MongoRepository<IEntity>({
    ...connectionContext,
    collectionName: entitiesCollectionName,
  });

  await Promise.all([entitiesRepository.init(), templatesRepository.init()]);

  const metadataGenerator = new MetadataGenerator(
    configurationService,
    timeService
  );
  const templatesService = new TemplatesService(
    loggerService,
    configurationService,
    templatesRepository,
    metadataGenerator
  );

  const entitiesValidator = new EntitiesValidator(templatesService);

  const entitiesService = new EntitiesService(
    loggerService,
    entitiesRepository,
    metadataGenerator,
    entitiesValidator
  );

  const templatesController = new TemplatesController(templatesService);
  const entitiesController = new EntitiesController(entitiesService);

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
