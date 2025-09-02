import {TemplateDetail} from './template-detail';

export class Template {
    
    id: number;
    name: string;
    created: number;
    profileId: number;
    companyId: number;
    details: TemplateDetail [];
        
}
