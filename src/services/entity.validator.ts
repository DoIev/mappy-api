import { IEntity } from "../models/entity.model";
import { isEmpty, intersection, sortBy, isEqual } from "lodash";
import { BadRequestError } from "../errors/badrequest.error";
import { ITemplatesService } from "./interfaces/templates.interface";

export class EntitiesValidator {
  constructor(private readonly templatesService: ITemplatesService) {}

  private throwErrorIfTemplateIdMissing(entity: IEntity): void {
    if (isEmpty(entity.templateId)) {
      throw new BadRequestError("Missing Template Id!");
    }
  }

  private async validateEntityFieldsMatchTemplate(
    entity: IEntity
  ): Promise<void> {
    const template = await this.templatesService.getTemplate(entity.templateId);
    const templateFieldsIds: string[] = template.fields.map(
      (field) => field.fieldId
    );
    const entityFieldsIds: string[] = entity.fields.map(
      (field) => field.fieldId
    );
    if (!isEqual(sortBy(entityFieldsIds), sortBy(templateFieldsIds)))
      throw new BadRequestError("entity fields dont match template!");
  }

  public async validateCreateEntityRequest(entity: IEntity): Promise<void> {
    this.throwErrorIfTemplateIdMissing(entity);
    await this.validateEntityFieldsMatchTemplate(entity);
  }

  public async validateUpdateEntityRequest(entity: IEntity): Promise<void> {
    if (isEmpty(entity._id)) {
      throw new BadRequestError("Entity Id not provided!");
    }

    this.throwErrorIfTemplateIdMissing(entity);
    await this.validateEntityFieldsMatchTemplate(entity);
  }
}
