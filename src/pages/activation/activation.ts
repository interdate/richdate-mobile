import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ActivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {

  form: any =
  {
      errorMessage: '',
      res: false,
      description: '',
      success: '',
      submit: false,
      phone: {label: '', value: ''},
      code: {label: '', value: ''}
  };

  os: any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiQuery,
      public  platform: Platform)
  {
      this.getForm()
  }

  getForm(data = '') {

      this.api.http.post(this.api.url + '/user/activate', data, this.api.setHeaders(true)).subscribe((resp: any) => {
          this.form.errorMessage = resp.activation;

          if(this.form.errorMessage) {
              this.api.hideLoad();
          }

      }, err => {
          this.api.hideLoad();
          this.navCtrl.push(LoginPage);
      });
  }

  formSubmit() {

      this.api.showLoad();

      let params = JSON.stringify({
              code: this.form.code.value
          });

      this.getForm(params);
  }

    ionViewWillEnter() {
        this.api.pageName = 'ActivationPage';
    }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ActivationPage');
  }

}
