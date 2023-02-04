import { Request, Response } from "express";
import { IEntitiesService } from "../services/interfaces/entiy.interface";
import { isEmpty } from "lodash";
import { IEntity } from "../models/entity.model";

export class EntitiesController {
  constructor(private readonly entitiesService: IEntitiesService) {}
  public async getEntities(request: Request, response: Response) {
    const { templateId } = request.query;
    let entities: IEntity[];
    if (!isEmpty(templateId)) {
      entities = await this.entitiesService.getEntitiesByTemplateId(
        templateId as string
      );
    } else {
      entities = await this.entitiesService.getAllEntities();
    }
    response.json(entities);
  }

  public async createEntity(request: Request, response: Response) {
    const entity: IEntity = request.body;
    const createdEntity = await this.entitiesService.createEntity(entity);
    if (isEmpty(createdEntity)) {
      response.statusCode = 403;
      response.send("Bad Request!");
    }

    response.json(createdEntity);
  }

  public async updateEntity(request: Request, response: Response) {
    const entity: IEntity = request.body;
    const updatedEntity = await this.entitiesService.updateEntity(entity);
    if (isEmpty(updatedEntity)) {
      response.statusCode = 403;
      response.send("Bad Request!");
    }

    response.json(updatedEntity);
  }
}
