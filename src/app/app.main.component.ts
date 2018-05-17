import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { projApi, allbackgroundList, allskillList, opportunitiesList } from './apis';
import { commonServices, bgdropdownSettings, skilldropdownSettings } from './common-services';
declare const google: any;

@Component({
  selector: 'app-main',
  templateUrl: './app.main.component.html',
  styleUrls: ['./app.main.component.css']
})

export class MainComponent implements OnInit {

  opportunitiesList: opportunitiesList;
  bgdropdownSettings: bgdropdownSettings;
  skilldropdownSettings: skilldropdownSettings;
  allbackgroundList: allbackgroundList;
  allskillList: allskillList;
  disabled: boolean;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  @ViewChild('staticModal') public staticModal: ModalDirective;

  constructor(private http: HttpClient,
    private modalService: BsModalService,
    private api: projApi,
    private services: commonServices
  ) {

  }
  ngOnInit() {

    this.getOpportunitiesList();
    this.getAllBackgroundList();
    this.getAllSkillList();

    this.bgdropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      idField: "id",
      textField: "name",
      limitSelection: 3
    };

    this.skilldropdownSettings = {
      singleSelection: true,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      idField: "id",
      textField: "name"
    };

  }

  getAllBackgroundList() {
    this.api.getAllBackgroundList().subscribe(backgroundList => {
      this.allbackgroundList = backgroundList;
    },
      error => console.log(error.error.error));

  }

  getAllSkillList() {
    this.api.getAllSkillList().subscribe(skillList => {
      this.allskillList = skillList;
    },
      error => console.log(error.error.error))
  }

  getOpportunitiesList() {

    this.api.getOpportunitiesList().subscribe(opportunitiesList => {
      this.opportunitiesList = this.services.formatData(opportunitiesList);
      setTimeout(() => { this.loadMap() }, 0);
    },
      error => console.log(error.error.error));

  }

  loadMap() {
    var latlng = new google.maps.LatLng(this.opportunitiesList.lat, this.opportunitiesList.lng);
    let map = new google.maps.Map(document.getElementById('googleMap'), {
      center: latlng,
      zoom: 12
    });

    new google.maps.Marker({
      position: latlng,
      map: map
    });
  }

  submit() {

    let result = this.services.validation(this.opportunitiesList);
    if (result.data) {
      this.staticModal.hide();
      this.api.patchOpportunitiesList({ 'opportunity': result.data }).subscribe(opportunitiesList => {
        this.getOpportunitiesList();
      },
        error => console.log(error.error.error));
    } else {
      alert(result.validation);
    }
  }

  handleAddressChange(address) {

    if (address) {
      this.opportunitiesList.lat = address.geometry.location.lat();
      this.opportunitiesList.lng = address.geometry.location.lng();
      this.opportunitiesList.role_info.city = address.name;
    }
  }

  closeModal() {
    this.staticModal.hide();
    this.getOpportunitiesList();
  }

  onValueChange(value: Date, flag): void {
    if (flag === 'startdate') {
      this.opportunitiesList.earliest_start_date = value;
    }
    if (flag === 'endDate') {
      this.opportunitiesList.latest_end_date = value;
    }
    if (flag === 'closeDate') {
      this.opportunitiesList.applications_close_date = value;
    }
  }

}
