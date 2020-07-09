import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from "jquery";
import {ApiQuery} from "../../library/api-query";
/**
 * Generated class for the Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page',
  templateUrl: 'page.html',
})
export class Page {

  page: any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiQuery
  ) {
    this.api.showLoad();
    this.api.http.get(this.api.url + '/user/page/' + this.navParams.get('pageId'), this.api.setHeaders(false)).subscribe(
      (data: any) => {
          //alert(JSON.stringify(data));
          console.log('page: ', data);
          this.page = data;
          this.api.hideLoad();
          $('#content').html(this.page.pageText);
          //this.content.scrollToTop(300);
        }, err => {
          console.log('register: ', err);
          this.page = {
            title: 'Page Error',
            content: err._body
          };
          $('#content').html(this.page.pageText);
          this.api.hideLoad();
        }
    );
  }


    ionViewWillLeave() {
        $('.back-btn').hide();
    }

    ionViewWillEnter() {
        this.api.pageName = 'PagePage';
        $('.back-btn').show();
    }

}
