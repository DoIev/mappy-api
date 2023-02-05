import { IEntity } from "../models/entity.model";
import { isEmpty, sortBy, isEqual } from "lodash";
import { BadRequestError } from "../errors/badrequest.error";
import { ITemplatesService } from "./interfaces/templates.interface";
import { ITemplateField } from "../models/field.model";
import { IEntityField } from "../models/field.model";
import { IConfigurationService } from "./interfaces/configuration.interface";

export class EntitiesValidator {
  private entityIdNotProvidedError: string;
  private entityFieldNotMatchTemplateError: string;
  private templateIdMissingError: string;

  constructor(
    private readonly templatesService: ITemplatesService,
    private readonly configurationService: IConfigurationService
  ) {
    this.initializeErrorMessages();
  }

  private initializeErrorMessages() {
    this.entityIdNotProvidedError = this.configurationService.get(
      "entityIdNotProvidedError"
    );
    this.entityFieldNotMatchTemplateError = this.configurationService.get(
      "entityFieldNotMatchTemplateError"
    );
    this.templateIdMissingError = this.configurationService.get(
      "templateIdMissingError"
    );
  }

  private throwErrorIfTemplateIdMissing(entity: IEntity): void {
    if (isEmpty(entity.templateId)) {
      throw new BadRequestError(this.templateIdMissingError);
    }
  }

  private async validateEntityFieldsMatchTemplate(
    entity: IEntity
  ): Promise<void> {
    const template = await this.templatesService.getTemplate(entity.templateId);
    const templateFieldsIds: string[] = template.fields.map(
      (field: ITemplateField) => field.fieldId
    );
    const entityFieldsIds: string[] = entity.fields.map(
      (field: IEntityField) => field.fieldId
    );
    if (!isEqual(sortBy(entityFieldsIds), sortBy(templateFieldsIds)))
      throw new BadRequestError(this.entityFieldNotMatchTemplateError);
  }

  public async validateCreateEntityRequest(entity: IEntity): Promise<void> {
    this.throwErrorIfTemplateIdMissing(entity);
    await this.validateEntityFieldsMatchTemplate(entity);
  }

  public async validateUpdateEntityRequest(entity: IEntity): Promise<void> {
    if (isEmpty(entity._id)) {
      throw new BadRequestError(this.entityIdNotProvidedError);
    }

    this.throwErrorIfTemplateIdMissing(entity);
    await this.validateEntityFieldsMatchTemplate(entity);
  }
}
