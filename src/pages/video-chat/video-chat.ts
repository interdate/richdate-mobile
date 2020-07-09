import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import {WebrtcProvider} from "../../providers/webrtc";
import {ApiQuery} from "../../library/api-query";

// import * as $ from "jquery";
// import {HomePage} from "../home/home";

/**
 * Generated class for the VideoChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-video-chat',
  templateUrl: 'video-chat.html',
})
export class VideoChatPage {
  status: any;
  topVideoFrame = 'partner-video';
  userId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  checkChat: any;
  cS: any = false;

  constructor(
    // public webRTC: WebrtcProvider,
    public api: ApiQuery,
    public navCtrl: NavController, public navParams: NavParams) {
    //this.api.storage.set('user_id', response.id);
    // if(navParams.get('id')) {
    //   this.webRTC.partnerId = navParams.get('id');
    // }
    // if(navParams.get('chatId')) {
    //   this.webRTC.chatId = navParams.get('chatId');
    // }
    this.api.storage.get('user_id').then((id) => {
      this.userId = id;

      //this.init();
    });

  }

  init() {
    // if(!this.webRTC.callLive.open) {
    //   this.webRTC.callLive.close()
    // }
    // this.myEl = $('#my-video')[0];
    // this.partnerEl = $('#partner-video')[0];
    // this.webRTC.init(this.userId, this.myEl, this.partnerEl);
    //
    //
    // let browser = this.api.iab.create('https://m.richdate.co.il/video.html?id='+this.userId+'&to='+this.webRTC.partnerId);
    /*
    * ,'_self',{
      location: 'no',
      fullscreen: 'yes',
      clearcache: 'yes',
      footer: "no"
    }
    * */
    // browser.on('exit').subscribe((e)=>{
    //   this.navCtrl.push(HomePage);
    // });
    // this.waitInit();



    // this.api.http.post(this.api.url + '/user/call/' + this.webRTC.partnerId,{message: 'call', id: this.webRTC.chatId}, this.api.setHeaders(true)).subscribe((data:any) => {
    //   let res = data.json();
    //   console.log('init');
    //   console.log(res);
    //   this.webRTC.chatId = res.call.msgId;
    //   this.status = res.call.msgBody;
    //   if(res.error != '') {
    //     let toast = this.api.toastCtrl.create({
    //       message: res.error,
    //       showCloseButton: true,
    //       closeButtonText: 'אישור'
    //     });
    //
    //     toast.present();
    //     this.navCtrl.push(HomePage);
    //   }else{
    //     if(this.status == 'answer' && this.webRTC.partnerId == res.call.msgFromId){
    //       // let that = this;
    //       // setTimeout(function () {
    //       //   that.call();
    //       // }, 1200);
    //     }else{
    //       // this.webRTC.wait();
    //     }
    //   }
    // });
  }

  // waitInit(){
  //   let that = this;
  //   setTimeout(function () {
  //     console.log('peer on');
  //     if (typeof that.webRTC.peer.on == "undefined"){
  //       that.webRTC.init(that.userId, that.myEl, that.partnerEl);
  //       that.waitInit();
  //     }else {
  //       that.wait();
  //     }
  //
  //   }, 100);
  // }

  // wait(){
  //     // that.webRTC.peer.on('open', () => {
  //     this.webRTC.wait();
  //     // });
  //   let that = this;
  //   // this.webRTC.peer.on('disconnected', function () {
  //   //     // if(parseInt(this.webRTC.partnerId) > 0) {
  //   //     //   this.webRTC.call();
  //   //     // }
  //   //     console.log('disconnected');
  //   //     // that.init();
  //   //     // this.webRTC.peer.reconnect();
  //   //   });
  //
  //   this.webRTC.peer.on('close', function () {
  //       // that.webRTC.partnerId = 0;
  //       let toast = that.api.toastCtrl.create({
  //         message: 'השיחה הסתיימה',
  //         showCloseButton: true,
  //         closeButtonText: 'אישור'
  //       });
  //
  //       toast.present();
  //       that.navCtrl.push(HomePage);
  //   });
  //
  // }
  //
  // call() {
  //   // if(parseInt(this.webRTC.partnerId) > 0) {
  //     this.webRTC.call();
  //     this.api.http.post(this.api.url + '/user/call/' + this.webRTC.partnerId, {
  //       message: 'talk',
  //       id: this.webRTC.chatId
  //     }, this.api.setHeaders(true)).subscribe((data: any) => {
  //       let res = data.json();
  //       console.log('call');
  //       console.log(res);
  //       this.status = 'talk';
  //       this.swapVideo('my-video');
  //     });
  //     this.cS = true;
  //   // }
  // }
  //
  // swapVideo(topVideo: string) {
  //   this.topVideoFrame = topVideo;
  //   this.cS = true;
  // }

  checkStatus(){
    // if(this.webRTC.chatId > 0) {
    //   this.api.http.get(this.api.url + '/user/call/status/' + this.webRTC.chatId, this.api.setHeaders(true)).subscribe((data: any) => {
    //     let res = data.json();
    //     //console.log('check'+res);
    //     console.log('check');
    //     console.log(res);
    //     this.status = res.status;
    //     //if(this.userId == )
    //     if (!this.cS && this.status == 'answer') {
    //       // this.call();
    //     }
    //
    //     // if(!this.cS && this.status == 'talk'){
    //     //
    //     //   if(this.topVideoFrame != 'my-video'){
    //     //     this.call();
    //     //     this.swapVideo('my-video');
    //     //   }
    //     // }
    //     if (this.status == 'close' || this.status == 'not_answer') {
    //       this.navCtrl.push(HomePage);
    //     }
    //   });
    // }
  }

  ionViewWillLeave() {
    // this.api.footer = true;
    // $('.back-btn').hide();
    // enable the root left menu when leaving the tutorial page
    // this.webRTC.myStream.getTracks().forEach(function(track) {
    //   track.stop();
    // });
    // this.myEl.srcObject = this.webRTC.myStream = null;
    // this.webRTC.callLive.close();
    // this.webRTC.chatId = 0;
    // this.webRTC.peer.destroy();
    clearInterval(this.checkChat);
    // if(this.status != 'close'){
    //   this.api.http.post(this.api.url + '/user/call/' + this.webRTC.partnerId,{message: 'close', id: this.webRTC.chatId}, this.api.setHeaders(true)).subscribe(data => {
    //     let res = data.json();
    //     console.log('close');
    //     console.log(res);
    //     this.status == 'close';
    //     // location.reload();
    //   });
    // }else{
    //   // location.reload();
    // }
  }

  ionViewWillLoad() {
    console.log('load');
    this.api.pageName = 'VideoChatPage';
    var that = this;
    this.checkStatus();
    this.checkChat = setInterval(function () {
      that.checkStatus();
    }, 10000);

  }

}
