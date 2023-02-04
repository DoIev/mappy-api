import { IEntity } from "../../models/entity.model";

export interface IEntitiesService {
  getAllEntities: () => Promise<IEntity[]>;
  getEntitiesByTemplateId: (templateId: string) => Promise<IEntity[]>;
  getEntityById: (entityId: string) => Promise<IEntity>;
  updateEntity: (newEntity: IEntity) => Promise<IEntity>;
  createEntity: (newEntity: IEntity) => Promise<IEntity>;
}
