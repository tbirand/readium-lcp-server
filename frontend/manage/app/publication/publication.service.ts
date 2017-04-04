import { Injectable }   from '@angular/core';
import { Http }         from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Publication }  from './publication';
import { MasterFile }   from './master-file';

import { CrudService }  from '../crud/crud.service';

declare var Config: any; //  this comes from the autogenerated config.js file

@Injectable()
export class PublicationService extends CrudService<Publication> {
    private masterFileListUrl: string;

    constructor (http: Http) {
        super();
        this.http = http;
        this.baseUrl = Config.frontend.url + '/api/v1/publications';
        this.masterFileListUrl = Config.frontend.url +
            '/api/v1/repositories/master-files';
    }

    decode(jsonObj: any): Publication {
        return {
            id: jsonObj.id,
            uuid: jsonObj.uuid,
            title: jsonObj.title,
            status: jsonObj.status,
            masterFilename: null
        }
    }

    encode(obj: Publication): any {
        return {
            id: obj.id,
            title: obj.title,
            masterFilename: obj.masterFilename
        }
    }

    checkByName(name: string): Promise<number> {
        var self = this
        return this.http
            .get(
                this.baseUrl + "/checkByTitle/" + name,
                { headers: this.defaultHttpHeaders })
            .toPromise()
            .then(function (response) {
                let jsonObj = response.json();
                return jsonObj;
            })
            .catch(this.handleError);
    }

    getMasterFiles(): Promise<MasterFile[]> {
        return this.http
            .get(
                this.masterFileListUrl,
                { headers: this.defaultHttpHeaders })
            .toPromise()
            .then(function (response) {
                if (response.ok) {
                    let items: MasterFile[] = [];

                    for (let jsonObj of response.json()) {
                        items.push({
                            name: jsonObj.name
                        });
                    }

                    return items;
                } else {
                    throw 'Error creating user ' + response.text;
                }
            })
            .catch(this.handleError);
    }
}
