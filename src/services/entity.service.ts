import { IEntity } from "../models/entity.model";
import { IRepository } from "../repositories/repository.interface";
import { ILoggerService } from "../services/interfaces/logger.interface";
import { IEntitiesService } from "./interfaces/entiy.interface";

import { isEmpty } from "lodash";
import { NotFoundError } from "../errors/notfound.error";
import { BadRequestError } from "../errors/badrequest.error";
import { MetadataGenerator } from "./metadata.generator";
import { EntitiesValidator } from "./entity.validator";

export class EntitiesService implements IEntitiesService {
  constructor(
    private readonly logger: ILoggerService,
    private readonly entitiesRepository: IRepository<IEntity>,
    private readonly metadataGenerator: MetadataGenerator,
    private readonly entitiesValidator: EntitiesValidator
  ) {}
  public getAllEntities(): Promise<IEntity[]> {
    return this.entitiesRepository.getAll();
  }
  public getEntitiesByTemplateId(templateId: string): Promise<IEntity[]> {
    return this.entitiesRepository.getByQuery({ templateId });
  }
  public async getEntityById(entityId: string): Promise<IEntity> {
    const entity = await this.entitiesRepository.getOneById(entityId);
    if (isEmpty(entity)) throw new NotFoundError("Entity Not Found!");
    return entity;
  }

  public async updateEntity(newEntity: IEntity): Promise<IEntity> {
    this.entitiesValidator.validateUpdateEntityRequest(newEntity);
    newEntity.fields.forEach((field) => {
      const oldMetadata = field.metadata;
      field.metadata = this.metadataGenerator.updateMetadata(oldMetadata);
    });
    return this.entitiesRepository.updateOne(newEntity);
  }

  public async createEntity(newEntity: IEntity): Promise<IEntity> {
    this.entitiesValidator.validateCreateEntityRequest(newEntity);
    newEntity.fields.forEach((field) => {
      if (isEmpty(field.metadata)) {
        field.metadata = this.metadataGenerator.generateMetadata();
      }
    });
    return this.entitiesRepository.createOne(newEntity);
  }
}
