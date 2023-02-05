import { ConfigurationService } from "./services/configuration.service";
import { IConfigurationService } from "./services/interfaces/configuration.interface";
import { MongoRepository } from "./repositories/mongo.repository";
import { ILoggerService } from "./services/interfaces/logger.interface";
import { LoggerService } from "./services/logger.service";
import { TemplatesService } from "./services/templates.service";
import { ITemplate } from "./models/template.model";
import { TemplatesController } from "./controllers/templates.controller";
import { MetadataGenerator } from "./services/metadata.generator";
import { TimeService } from "./services/time.service";
import { EntitiesController } from "./controllers/entity.controller";
import { EntitiesService } from "./services/entity.service";
import { IEntity } from "./models/entity.model";
import { EntitiesValidator } from "./services/entity.validator";

export async function bootstrap() {
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

  const entitiesValidator = new EntitiesValidator(
    templatesService,
    configurationService
  );

  const entitiesService = new EntitiesService(
    loggerService,
    entitiesRepository,
    metadataGenerator,
    entitiesValidator
  );

  const templatesController = new TemplatesController(templatesService);
  const entitiesController = new EntitiesController(entitiesService);

  return {
    templatesController,
    entitiesController,
    configurationService,
    loggerService,
  };
}
