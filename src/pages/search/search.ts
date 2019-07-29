import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ApiQuery } from '../../library/api-query';
import {AdvancedsearchPage} from "../advancedsearch/advancedsearch";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  age: any;
  areas: any;
  ages: any = [];

  type_search: any = "";
  form: any = {
    form: {
      username: {value: '',label:''},
      region: { choices: [[]], value: '', label:''},
      ageFrom: {choices: [[]], label: '',value:''},
      ageTo: {choices: [[]], label: '',value:''},
      MaritalStatus: {choices: [[]], label: '' ,value:''},
      SexPref: {choices: [[]], label: '' ,value:''}
     }
  };


    ageLower: any = 20;
    ageUpper: any = 50;

    default_range: any = { lower: this.ageLower, upper: this.ageUpper }

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiQuery
      ) {
  
      this.age = {
        'lower': this.form.form.ageFrom.value,
        'upper': this.form.form.ageTo.value
      };
  
      for (let i = 18; i <= 65; i++) {
        this.ages.push({num: i});
      }
  
      this.api.http.get( api.url + '/user/form/sreach/', api.setHeaders(true) ).subscribe(data => {
  
         this.form.form = data.json();
  
        },err => {
          console.log("Oops!");
        });
    }

    SeachForm1(search_type) {
      console.log(this.form);
      //this.toSearchResultsPage('search-form-1');
    }
  

    toSearchResultsPage(){
      
          if( this.form.form.username.value == '' ) {

            let params = JSON.stringify({
              action: 'search',
              searchparams: {
                region: this.form.form.region.value,
                agefrom: this.form.form.ageFrom.value,
                ageto: this.form.form.ageTo.value,
                sexpreef: this.form.form.SexPref.value,
                meritalstat: this.form.form.MaritalStatus.value,
                userNick: ''},
                page: 1,
                list: '',
                filter: 'lastActivity'

            });
            /*let params = "action=search&quick_search[region]=" + this.form.form.region.value +
            "&quick_search[ageFrom]="+ this.age.lower +
            "&quick_search[ageTo]=" + this.age.upper; distance: this.form.form.distance.value*/
      
            this.navCtrl.push(HomePage, { params: params });
          }else{
            let params = JSON.stringify({
              action: 'search',
              searchparams: {
                region: '',
                agefrom: '',
                ageto: '',
                sexpreef: '',
                meritalstat: '',
               userNick: this.form.form.username.value
              },
                page: 1,
                list: '',
                filter: 'lastActivity'
            });
              /*action: 'search',
              quick_search: {
                username: this.form.form.username.value
              }
            });*/
      
            this.navCtrl.push(HomePage, { params: params });
          }
    }
      
    getAgeValues(event) {
          if( event.value.upper != 0) {
            this.ageUpper = event.value.upper;
          }
          if( event.value.lower != 0) {
            this.ageLower = event.value.lower;
          }
    }
      
    toAdvancedPage() {
        this.navCtrl.push(AdvancedsearchPage);
    }
      
    ionViewWillEnter() {
        this.api.pageName = 'SearchPage';
    }
  
    ionViewDidLoad() {
      this.type_search = 'search-1';
    }


}
