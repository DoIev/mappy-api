import { Request, Response } from "express";
import { TemplatesService } from "../services/templates.service";
import { isEmpty } from "lodash";

export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  public async getAllTemplates(request: Request, response: Response) {
    const templates = await this.templatesService.getAllTemplates();
    response.json(templates);
  }

  public async getTemplateById(request: Request, response: Response) {
    const { templateId } = request.params;
    if (isEmpty(templateId)) {
      response.statusCode = 403;
      response.send("Bad Request! Wheres the template ID?");
      return;
    }
    const template = await this.templatesService.getTemplate(templateId);

    if (isEmpty(template)) {
      response.statusCode = 404;
      response.send("Template Not found!");
      return;
    }
    response.json(template);
  }

  public async createTemplate(request: Request, response: Response) {
    const template = request.body;
    const createdTemplate = await this.templatesService.createTemplate(
      template
    );
    if (isEmpty(createdTemplate)) {
      response.statusCode = 500;
      response.send("Could not Create Template!");
      return;
    }
    response.json(createdTemplate);
  }
}
