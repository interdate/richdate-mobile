import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import {HomePage} from "../home/home";
import {ApiQuery} from "../../library/api-query";
import {Storage} from "@ionic/storage";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {RegisterPage} from "../register/register";
import * as $ from "jquery";
import {SubscriptionPage} from "../subscription/subscription";
import {ChangePhotosPage} from "../change-photos/change-photos";
import {ActivationPage} from "../activation/activation";
import {PasswordRecoveryPage} from "../password-recovery/password-recovery";

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
  header: RequestOptions;
  user: any = {id: '', name: ''};
  fingerAuth: any;
  enableFingerAuth: any;
  disableFingerAuthInit: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              public api: ApiQuery,
              public storage: Storage,
              public toastCtrl: ToastController
  ) {

    this.http.get(api.url + '/user/form/login', api.setHeaders(false)).subscribe(data => {
      this.form = data.json();
      this.storage.get('username').then((username) => {
        this.form.login.username.value = username;
        this.user.name = username;
      });
    });

    this.storage = storage;

    if (navParams.get('page') && navParams.get('page')._id == "logout") {

      this.api.setHeaders(false, null, null);
      // Removing data storage
      this.api.username = null;
      this.api.password = null;
      this.api.status = '';
      this.storage.remove('status');
      this.storage.remove('password');
      this.storage.remove('user_id');
      this.storage.remove('user_photo');
    }

    if (navParams.get('error')) {
      this.errors = navParams.get('error');
    }
  }

  formSubmit(type) {
    this.form.login.username.value = this.user.name;
    let username = encodeURIComponent(this.form.login.username.value);
    let password = encodeURIComponent(this.form.login.password.value);

    if (username == "") {
      username = "nologin";
    }

    if (password == "") {
      password = "nopassword";
    }

    this.http.post(this.api.url + '/user/login/', '', this.setHeaders()).map((res: Response) => res.json()).subscribe(data => { //.map((res: Response) => res.json())

      setTimeout(function () {
        this.errors = 'משתמש זה נחסם על ידי הנהלת האתר';
      }, 300);

      this.validate(data);

    }, err => {
      //console.log(err.status);
      type == 'fingerprint' ? '' : this.errors = err.text();

    });
  }

  setHeaders() {
    let myHeaders: Headers = new Headers;
    myHeaders.append('Content-type', 'application/json');
    myHeaders.append('Accept', '*/*');
    myHeaders.append('Access-Control-Allow-Origin', '*');
    myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.form.login.username.value) + ':' + encodeURIComponent(this.form.login.password.value)));

    this.header = new RequestOptions({
      headers: myHeaders
    });
    return this.header;
  }

  validate(response) {

    if (response.status != "not_activated") {
      this.storage.set('username', this.form.login.username.value);
      this.storage.set('password', this.form.login.password.value);
      this.storage.set('status', response.status);
      this.storage.set('user_id', response.id);
      this.storage.set('user_photo', response.photo);

      this.api.setHeaders(true, this.form.login.username.value, this.form.login.password.value);

      this.api.sendBrowserPhoneId();

    }
    if (response.status) {
      let data = {
        status: 'init',
        username: this.form.login.username.value,
        password: this.form.login.password.value
      };

      this.storage.set('user_photo', response.photo);
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
    this.storage.get('deviceToken').then((deviceToken) => {
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
