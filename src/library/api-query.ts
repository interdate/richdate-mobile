import {Component} from "@angular/core";
import {AlertController, LoadingController, Platform, ModalController, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {DomSanitizer} from "@angular/platform-browser";
import {Geolocation} from "@ionic-native/geolocation";
import {Keyboard} from "@ionic-native/keyboard";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InAppBrowser} from "@ionic-native/in-app-browser";
// import * as $ from "jquery";


@Component({
  templateUrl: 'api.html'
})
export class ApiQuery {

  public url: any;
  // public header: RequestOptions;
  public header: any = {};
  public header1: any;
  public response: any;
  public username: any;
  public password: any;
  public status: any = '';
  public back: any = false;
  public storageRes: any;
  public footer: any = true;
  public pageName: any = '';
  public loading: any;
  public resultsPerPage: any = 20;
  public signupData: { username: any, password: any };
  public isPay: any;
  public myPhotos: any;
  public isBanner: any = false;
  public callAlertShow:any = false;
  public videoChat: any = null;
  public videoTimer: any = null;
  public callAlert: any;
  public audioCall: any;
  public audioWait: any;

  constructor(
      public storage: Storage,
      public alertCtrl: AlertController,
      public http: HttpClient,
      public http1: HttpClient,
      public loadingCtrl: LoadingController,
      private sanitizer: DomSanitizer,
      public modalCtrl: ModalController,
      public toastCtrl: ToastController,
      private geolocation: Geolocation,
      public keyboard: Keyboard,
      public iab: InAppBrowser,
      public plt: Platform
  ) {
   // this.url = 'http://10.0.0.12:8100';
      // this.url = 'http://localhost:8100';
      this.url = '/api/v9';

      this.storage.get('user_id').then((val) => {
          this.storage.get('username').then((username) => {
            this.username = username;
          });
          this.storage.get('password').then((password) => {
            this.password = password;
          });
      });
  }

  openVideoChat(param){
    this.storage.get('user_id').then((id) => {
      if(this.callAlert && this.callAlert != null) {
        this.callAlert.dismiss();
        this.callAlert = null;
      }
      this.playAudio('call');

      this.http.post(this.url + '/user/call/' + param.id,{message: 'call', id: param.chatId}, this.setHeaders(true)).subscribe((res:any) => {
        this.stopAudio();

        console.log('init');
        console.log(res);
        if(res.error != '') {
          let toast = this.toastCtrl.create({
            message: res.error,
            showCloseButton: true,
            closeButtonText: 'אישור'
          });

          toast.present();
        }else{
          if(res.call.sendPush) {
            this.http.post(this.url + '/user/call/push/' + param.id, {}, this.setHeaders(true)).subscribe((data: any) => {

            });
          }
          param.chatId = res.call.msgId;
          this.videoChat = window.open('https://m.richdate.co.il/video.html?id='+id+'&to='+param.id, '_parent', "fullscreen=yes");

          let that = this;
          setTimeout(function () {
            that.videoChat.addEventListener('exit', function(){
              //alert('exit');
              console.log('close window');
              that.http.post(that.url + '/user/call/' + param.id,{message: 'close', id: param.chatId}, that.setHeaders(true)).subscribe((data:any) => {
                // let res = data.json();
              });
              that.videoChat = null;
            });

            if(param.alert == false) {
              that.checkVideoStatus(param);
            }
          },1500);
        }
      }, error => {
        this.stopAudio();
        console.log(error);
      });


    });
  }

  playAudio(audio) {
    if(this.callAlertShow == false) {
      this.showLoad();
    }

    if(audio == 'call') {
      this.audioCall.play();
      this.audioCall.loop = true;
    } else {
      this.audioWait.play();
      this.audioWait.loop = true;
    }
  }

  stopAudio() {
    this.audioCall.pause();
    this.audioCall.currentTime = 0;
    this.audioWait.pause();
    this.audioWait.currentTime = 0;
    this.hideLoad();
  }

  checkVideoStatus(param){
    console.log('check call');
    console.log(param);
    this.http.get(this.url + '/user/call/status/' + param.chatId, this.setHeaders(true)).subscribe((res: any) => {
      // let res = data.json();
      console.log('check');
      console.log(res);
      this.status = res.status;
      if (res.status == 'answer') {
      }
      if (res.status == 'close' || res.status == 'not_answer') {


        this.stopAudio();
        if (this.videoChat != null || this.callAlert != null) {

          let toast = this.toastCtrl.create({
            message: (this.status == 'not_answer' && this.videoChat && this.videoChat != null) ? ('השיחה עם ' + param.username + ' נדחתה') : 'השיחה הסתיימה',
            showCloseButton: true,
            closeButtonText: 'אישור'
          });
          toast.present();
        }
        if(this.callAlert && this.callAlert != null) {
          this.callAlert.dismiss();
          this.callAlert = null;
        }
        if(this.videoChat && this.videoChat != null) {
          this.videoChat.close();
          this.videoChat = null;
        }
      }

      if (this.videoChat != null || this.callAlert != null) {
        let that = this;
        setTimeout(function () {
          that.checkVideoStatus(param)
        }, 3000);
      }
    });

  }

  sendBrowserPhoneId() {

    this.storage.get('fcmToken').then((token) => {
      if (token) {
        let data = JSON.stringify({deviceId: token});
        let os = 'Browser';
        //alert(os);
        this.http.post(this.url + '/user/deviceId/OS:' + os, data, this.setHeaders(true)).subscribe(data => {
        },err => {
        });
      }
    });
  }


  presentToast(txt, duration = 3000) {
    let toast = this.toastCtrl.create({
      message: txt,
      duration: duration,
    });

    toast.present();
  }

  preview(navCtrl, url){
    navCtrl.push('FullScreenProfilePage',{user: {userId:0,photos:[{url:url}]}});
  }

  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  sendPhoneId(idPhone) {
    let data = JSON.stringify({deviceId: idPhone});
    this.http.post(this.url + '/user/deviceId/OS:' + 'Browser', data, this.setHeaders(true)).subscribe(data => {
    });
  }

  setUserData(data) {
    this.setStorageData({label: 'username', value: data.username});
    this.setStorageData({label: 'password', value: data.password});
  }

  /**
   *  Set User's Current Location
   */
  setLocation() {

    this.geolocation.getCurrentPosition().then((pos) => {
      let params = JSON.stringify({
        latitude: '' + pos.coords.latitude + '',
        longitude: '' + pos.coords.longitude + ''
      });

      if (this.password) {
        this.http.post(this.url + '/user/location', params, this.setHeaders(true)).subscribe(data => {
        });
      }
    });
  }

  setStorageData(data) {
    this.storage.set(data.label, data.value);
  }

  showLoad(txt = 'אנא המתן...') {
    if (this.isLoaderUndefined()) {
      this.loading = this.loadingCtrl.create({
        content: txt
      });

      this.loading.present();
    }
  }

  functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }

  hideLoad() {
    if (!this.isLoaderUndefined())
      this.loading.dismiss();
    this.loading = undefined;
  }

  isLoaderUndefined(): boolean {
    return (this.loading == null || this.loading == undefined);
  }

  getUserData() {
    this.storage.get('user_id').then((val) => {
      this.storage.get('username').then((username) => {
        this.username = username;
      });
      this.storage.get('password').then((password) => {
        this.password = password;
      });
    });
    return {username: this.username, password: this.password}
  }

  setHeaders(is_auth = false, username = false, password = false, register = "0") {

    if (username !== false) {
      this.username = username;
    }

    if (password !== false) {
      this.password = password;
    }

    let myHeaders = new HttpHeaders();

    myHeaders = myHeaders.append('Content-type', 'application/json');
    myHeaders = myHeaders.append('Accept', '*/*');
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');

    if (is_auth == true) {
      myHeaders = myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
    }
    this.header = {
      headers: myHeaders
    };
    return this.header;

    // if (username !== false) {
    //   this.username = username;
    // }
    //
    // if (password !== false) {
    //   this.password = password;
    // }
    //
    // let myHeaders: Headers = new Headers;
    //
    // myHeaders.append('Content-type', 'application/json');
    // myHeaders.append('Accept', '*/*');
    // myHeaders.append('Access-Control-Allow-Origin', '*');
    //
    //
    // if (is_auth == true) {
    //   myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
    //   /*@encodeURIComponent(this.username)*/
    // }
    // this.header = new RequestOptions({
    //   headers: myHeaders
    // });
    // return this.header;
  }

  setHeaders1(is_auth = false, username = false, password = false) {

    if (username !== false) {
      this.username = username;
    }

    if (password !== false) {
      this.password = password;
    }

    let myHeaders = new HttpHeaders();

    myHeaders = myHeaders.append('Content-type', 'application/json');
    myHeaders = myHeaders.append('Accept', '*/*');
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');

    if (is_auth == true) {
      myHeaders = myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
    }
    this.header1 = {
      headers: myHeaders
    };
    return this.header1;
  }

  ngAfterViewInit() {
    this.storage.get('user_id').then((val) => {
      this.storage.get('username').then((username) => {
        this.username = username;
      });
      this.storage.get('password').then((password) => {
        this.password = password;
      });
    });
  }
}
