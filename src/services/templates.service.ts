import { IRepository } from "../repositories/repository.interface";
import { ILoggerService } from "./interfaces/logger.interface";
import { ITemplate } from "../models/template.model";
import { isEmpty } from "lodash";
import { IConfigurationService } from "../services/interfaces/configuration.interface";
import { MetadataGenerator } from "./metadata.generator";

export class TemplatesService {
  constructor(
    private readonly logger: ILoggerService,
    private readonly configurationService: IConfigurationService,
    private readonly templatesRepository: IRepository<ITemplate>,
    private readonly metadataGenerator: MetadataGenerator
  ) {}
  public getAllTemplates(): Promise<ITemplate[]> {
    return this.templatesRepository.getAll();
  }
  public getTemplate(templateId: string): Promise<ITemplate> {
    try {
      return this.templatesRepository.getOneById(templateId);
    } catch (error) {
      return null;
    }
  }
  public createTemplate(template: ITemplate): Promise<ITemplate> {
    const metadata = template.metadata;
    if (isEmpty(metadata)) {
      template.metadata = this.metadataGenerator.generateMetadata();
    }
    try {
      return this.templatesRepository.createOne(template);
    } catch (error) {
      return null;
    }
  }
}
