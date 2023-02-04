import { ITemplate } from "../../models/template.model";

export interface ITemplatesService {
  getAllTemplates: () => Promise<ITemplate[]>;
  getTemplate: (templateId: string) => Promise<ITemplate>;
  createTemplate: (template: ITemplate) => Promise<ITemplate>;
}
