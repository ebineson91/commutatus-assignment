import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface opportunitiesList {
  id: number,
  lat?: string,
  lng?: string,
  title?: string,
  applications_close_date?: any,
  earliest_start_date?: any,
  latest_end_date?: any,
  description?: string,
  backgrounds?: Array<allbackgroundList>,
  skills?: Array<allskillList>,
  specifics_info?: {
    salary?: number
  },
  role_info?: {
    city?: string,
    selection_process?: string
  }
}

export interface postOpportunitiesList {
  opportunity: {
    id: number,
    lat?: string,
    lng?: string,
    title?: string,
    applications_close_date?: any,
    earliest_start_date?: any,
    latest_end_date?: any,
    description?: string,
    backgrounds?: Array<allbackgroundList>,
    skills?: Array<allskillList>,
    specifics_info?: {
      salary?: number
    },
    role_info?: {
      city?: string,
      selection_process?: string
    }

  }

}

export interface allbackgroundList {
  id: number;
  name?: string;
  matching_with_opportunity?: string;
  option?: any;
}

export interface allskillList {
  id: number;
  name?: string;
  matching_with_opportunity?: string;
  option?: any;
  level?: any;
}


@Injectable()
export class projApi {
  constructor(private http: HttpClient) { }

  params = new HttpParams().set('access_token', 'dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c');
  BaseURL = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/';

  getOpportunitiesList() {
    return this.http.get(this.BaseURL + 'v2/opportunities/1624', { params: this.params })
      .map((res: opportunitiesList) => {
        return res;
      });
  }

  getAllBackgroundList() {
    return this.http.get(this.BaseURL + 'v2/lists/backgrounds', { params: this.params })
      .map((res: allbackgroundList) => {
        return res;
      });
  }

  getAllSkillList() {
    return this.http.get(this.BaseURL + 'v2/lists/skills', { params: this.params })
      .map((res: allskillList) => {
        return res;
      });
  }

  patchOpportunitiesList(opportunity: postOpportunitiesList) {
    return this.http.patch(this.BaseURL + 'v2/opportunities/1624', opportunity, { params: this.params })
      .map((res: opportunitiesList) => {
        return res;
      });
  }

}
