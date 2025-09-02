import {Injectable} from '@angular/core';
import {TemplateRepository} from './template-repository';

@Injectable({providedIn: 'any'})
export class TemplateService {

  constructor(private repository: TemplateRepository) {
  }

  findAllByProfileId(id) {
    return this.repository.findAllByCompany(id);
  }

  findById(id) {
    return this.repository.findById(id);
  }

  delete(id) {
    return this.repository.delete(id);
  }

  deleteDetail(templateId, detailId) {
    return this.repository.deleteDetail(templateId, detailId);
  }

  create(profileId, name) {
    return this.repository.create(profileId, name);
  }

  createDetail(templateId, detail) {
    return this.repository.createDetail(templateId, detail);
  }
}
