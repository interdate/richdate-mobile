import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import {HomePage} from "../home/home";
import {ApiQuery} from "../../library/api-query";
// import {Headers, RequestOptions, Response} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {RegisterPage} from "../register/register";
import * as $ from "jquery";
import {SubscriptionPage} from "../subscription/subscription";
import {ChangePhotosPage} from "../change-photos/change-photos";
import {ActivationPage} from "../activation/activation";
import {PasswordRecoveryPage} from "../password-recovery/password-recovery";
import {HttpHeaders} from "@angular/common/http";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  form: { errors: any, login: any } = {errors: {}, login: {username: {label: ''}, password: {label: ''}}};
  errors: any;
  header: any = {};
  user: any = {id: '', name: ''};
  fingerAuth: any;
  enableFingerAuth: any;
  disableFingerAuthInit: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public api: ApiQuery,
              public toastCtrl: ToastController
  ) {

    this.api.http.get(this.api.url + '/user/form/login', this.api.setHeaders(false)).subscribe((data:any) => {
      this.form = data;
      this.api.storage.get('username').then((username) => {
        this.form.login.username.value = username;
        this.user.name = username;
      });
    });


    if (navParams.get('page') && navParams.get('page')._id == "logout") {

      this.api.setHeaders(false, null, null);
      // Removing data storage
      this.api.username = null;
      this.api.password = null;
      this.api.status = '';
      this.api.storage.remove('status');
      this.api.storage.remove('password');
      this.api.storage.remove('user_id');
      this.api.storage.remove('user_photo');
    }

    if (navParams.get('error')) {
      this.errors = navParams.get('error');
    }
  }

  formSubmit(type) {
    // this.form.login.username.value = this.user.name;
    // let username = encodeURIComponent(this.form.login.username.value);
    // let password = encodeURIComponent(this.form.login.password.value);
    //
    // if (username == "") {
    //   username = "nologin";
    // }
    //
    // if (password == "") {
    //   password = "nopassword";
    // }

    this.api.http.post(this.api.url + '/user/login/', '', this.setHeaders()).subscribe((data: any) => { //.map((res: Response) => res.json())
      // const data = res.json();
      setTimeout(function () {
        this.errors = 'משתמש זה נחסם על ידי הנהלת האתר';
      }, 300);

      this.validate(data);

    }, err => {
      console.log(err);
      this.errors = type == 'fingerprint' ? '' : err.error;

    });
  }

  setHeaders() {

    let myHeaders = new HttpHeaders();

    myHeaders = myHeaders.append('Content-type', 'application/json');
    myHeaders = myHeaders.append('Accept', '*/*');
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');
    myHeaders = myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.form.login.username.value) + ':' + encodeURIComponent(this.form.login.password.value)));

    this.header = {
      headers: myHeaders
    };
    return this.header;
  }

  validate(response) {

    if (response.status != "not_activated") {
      this.api.storage.set('username', this.form.login.username.value);
      this.api.storage.set('password', this.form.login.password.value);
      this.api.storage.set('status', response.status);
      this.api.storage.set('user_id', response.id);
      this.api.storage.set('user_photo', response.photo);

      this.api.setHeaders(true, this.form.login.username.value, this.form.login.password.value);

      this.api.sendBrowserPhoneId();

    }
    if (response.status) {
      // let data = {
      //   status: 'init',
      //   username: this.form.login.username.value,
      //   password: this.form.login.password.value
      // };

      this.api.storage.set('user_photo', response.photo);
      if (response.status == "notActivated") {
        this.navCtrl.push(ActivationPage);
      } else if (response.status == "noimg") {
        this.user.id = response.id;
        let toast = this.toastCtrl.create({
          message: "לכניסה לאתר ריצ'דייט יש להעלות תמונה‎",
          duration: 3000
        });

        toast.present();
        this.navCtrl.push(ChangePhotosPage, {
          user: this.user,
          username: this.form.login.username.value,
          password: this.form.login.password.value
        });
      } else if (response.userIsPaying == 0) {
        this.navCtrl.push(SubscriptionPage);
      } else {
        this.navCtrl.setRoot(HomePage, {
          params: 'login',
          username: this.form.login.username.value,
          password: this.form.login.password.value
        });
      }

    } else if (response.status == "noimg") {
      this.user.id = response.id;

      this.navCtrl.push(ChangePhotosPage, {
        user: this.user,
        username: this.form.login.username.value,
        password: this.form.login.password.value
      });
    }
    this.api.storage.get('deviceToken').then((deviceToken) => {
      this.api.sendPhoneId(deviceToken);
    });
  }

  onRegistrationPage() {
    this.navCtrl.push(RegisterPage);
  }

  onPasswordRecoveryPage() {
    this.navCtrl.push(PasswordRecoveryPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    this.api.pageName = 'LoginPage';
    $('.back-btn').hide();
  }

}
