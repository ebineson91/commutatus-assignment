import { Injectable } from '@angular/core';

export interface bgdropdownSettings {
    singleSelection: boolean,
    itemsShowLimit: number,
    allowSearchFilter: boolean,
    idField: string,
    textField: string,
    limitSelection: number
}

export interface skilldropdownSettings {
    singleSelection: boolean,
    itemsShowLimit: number,
    allowSearchFilter: boolean,
    idField: string,
    textField: string,
}

@Injectable()
export class commonServices {

    formatData(opportunity) {
        opportunity.lat = parseInt(opportunity.lat);
        opportunity.lng = parseInt(opportunity.lng);
        opportunity.earliest_start_date = new Date(opportunity.earliest_start_date);
        opportunity.latest_end_date = new Date(opportunity.latest_end_date);
        opportunity.applications_close_date = new Date(opportunity.applications_close_date);
        return opportunity;
    }

    validation(opportunity) {

        if(!opportunity.title.trim() || !opportunity.description.trim() || isNaN(Date.parse(opportunity.earliest_start_date)) || isNaN(Date.parse(opportunity.latest_end_date)) || isNaN(Date.parse(opportunity.applications_close_date)) || !opportunity.role_info.city.trim() || !opportunity.role_info.selection_process.trim()){
            return { 'validation': 'All fields are mandatory or cannot be empty', 'data': null };
        };

        if(opportunity.specifics_info.salary < 0){
            return { 'validation': 'Salary cannot be negative number', 'data': null };
        }

        var currentDate = new Date();
        if (opportunity.applications_close_date < currentDate) {
            return { 'validation': 'Close Date should be between 30 to 90 days from current date', 'data': null };
        }
        var diff = Math.abs(opportunity.applications_close_date.getTime() - currentDate.getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        if (diffDays >= 30 && diffDays <= 92) {
            let data = this.formPostData(opportunity);
            return { 'validation': true, 'data': data.opportunity };
        } else {
            return { 'validation': 'Close Date should be between 30 to 90 days from current date', 'data': null };
        }
    }

    formPostData(opportunity) {
        opportunity.lat = opportunity.lat.toString();
        opportunity.lng = opportunity.lng.toString();
        opportunity.earliest_start_date = opportunity.earliest_start_date.toISOString();
        opportunity.latest_end_date = opportunity.latest_end_date.toISOString();
        opportunity.applications_close_date = opportunity.applications_close_date.toISOString();
        for (var i = 0; i < opportunity.backgrounds.length; i++) {
            opportunity.backgrounds[i].option = null;
        };
        for (var i = 0; i < opportunity.skills.length; i++) {
            opportunity.skills[i].option = null;
            opportunity.skills[i].level = null;
        };
        let postData = {
            'opportunity': {
                "lat": opportunity.lat,
                "lng": opportunity.lng,
                "title": opportunity.title,
                "applications_close_date": opportunity.applications_close_date,
                "earliest_start_date": opportunity.earliest_start_date,
                "latest_end_date": opportunity.latest_end_date,
                "description": opportunity.description,
                "backgrounds": opportunity.backgrounds,
                "skills": opportunity.skills,
                "specifics_info": {
                    "salary": opportunity.specifics_info.salary
                },
                "role_info": {
                    "city": opportunity.role_info.city,
                    "selection_process": opportunity.role_info.selection_process
                }
            }
        }
        return postData;
    }
}

