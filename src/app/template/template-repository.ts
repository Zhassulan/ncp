import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Template} from './model/template';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {httpHeaders} from '../settings';
import {TemplateDetail} from './model/template-detail';

const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'any'
})
export class TemplateRepository {

    constructor(private http: HttpClient) {
    }

    findAllByCompany(profileId): Observable<Template []> {
        return this.http.get<Template []>(`${API_URL}/templates/company/${profileId}`).pipe(catchError(HttpErrHandler.handleError));
    }

    findById(id): Observable<Template> {
        return this.http.get<Template>(`${API_URL}/templates/${id}`).pipe(catchError(HttpErrHandler.handleError));
    }

    delete(id): Observable<any> {
        return this.http.delete(`${API_URL}/templates/${id}`).pipe(catchError(HttpErrHandler.handleError));
    }

    deleteDetail(templateId, detailId): Observable<any> {
        return this.http.delete(`${API_URL}/templates/${templateId}/details/${detailId}`).pipe(catchError(HttpErrHandler.handleError));
    }

    create(profileId, name): Observable<Template> {
        return this.http.post<Template>(`${API_URL}/templates`, { profileId: profileId, name: name}, {headers: httpHeaders}).pipe(catchError(HttpErrHandler.handleError));
    }

    createDetail(templateId, detail): Observable<any> {
        return this.http.post<TemplateDetail>(`${API_URL}/templates/${templateId}/details`, detail, {headers: httpHeaders}).pipe(catchError(HttpErrHandler.handleError));
    }

}
