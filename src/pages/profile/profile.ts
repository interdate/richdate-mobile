import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Nav, ToastController, Content, LoadingController} from "ionic-angular";
import {Http} from "@angular/http";
import {ApiQuery} from "../../library/api-query";
import {Storage} from "@ionic/storage";
import {FullScreenProfilePage} from "../full-screen-profile/full-screen-profile";
import {DialogPage} from "../dialog/dialog";
declare var $: any;
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    @ViewChild(Content) content: Content;
    @ViewChild(Nav) nav: Nav;

    isAbuseOpen: any = false;

    user: any = {};

    texts: { lock: any, unlock: any } = {lock: '', unlock: ''};

    formReportAbuse: { title: any, buttons: { cancel: any, submit: any }, text: { label: any, name: any, value: any } } =
    {title: '', buttons: {cancel: '', submit: ''}, text: {label: '', name: '', value: ''}};

    myId: any = false;

    imageClick: boolean = false;


    constructor(public toastCtrl: ToastController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public loadingCtrl: LoadingController,
                public api: ApiQuery,
                public storage: Storage) {

        this.storage = storage;


        let loading = this.loadingCtrl.create({
            content: 'אנא המתן...'
        });

        //loading.present();

        var user = navParams.get('user');

        let userId = navParams.get('userId');


        if (user && typeof user.photoLarge != 'undefined') {
            user.photos = [{url: user.photoLarge}];
        }

        if (!user && userId != 0) {
            user = {
                id: userId
            };
        }

        if (user && user.id) {

            this.user = user;
            this.storage.get('username').then((username) => {
                this.storage.get('password').then((password) => {

                    this.http.get(api.url + '/user/profile/' + this.user.id, api.setHeaders(true,username,password)).subscribe(data => {
                        this.user = data.json();
                        this.formReportAbuse = data.json().formReportAbuse;
                        this.texts = data.json().texts;
                        loading.dismiss();
                        this.imageClick = true;
                    });
                });
            });
        } else {

            this.storage.get('user_id').then((val) => {
                if (val) {
                    this.myId = val;
                    this.http.get(api.url + '/user/profile/' + this.myId, api.setHeaders(true)).subscribe(data => {
                        this.user = data.json();

                        this.formReportAbuse = data.json().formReportAbuse;
                        this.texts = data.json().texts;
                        loading.dismiss();
                        this.imageClick = true;
                    });
                }
            });
        }
    }

    setHtml(id, html) {
        if ($('.' + id).html() == '' && html != '') {
            let div: any = document.createElement('div');
            div.innerHTML = html;
            /*
             [].forEach.call(div.getElementsByTagName("a"), (a) => {
             var pageHref = a.getAttribute('onclick');
             if (pageHref) {
             a.removeAttribute('onclick');
             a.onclick = () => this.getPage(pageHref);
             }
             });*/
            $('.' + id).append(div);
        }
    }

    scrollToBottom() {
        this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 300);
    }

    /*addFavorites(user) {

     if (!user.is_in_favorite_list) {
     user.is_in_favorite_list = true;


     let params = JSON.stringify({
     list: 'Favorite'
     });

     this.http.post(this.api.url + '/user/managelists/favi/1/' + this.user.userId, params, this.api.setHeaders(true)).subscribe(data => {
     let toast = this.toastCtrl.create({
     message: data.json().success,
     duration: 3000
     });

     toast.present();
     });
     }
     }*/

    addFavorites(user) {
        // this.user.isAddFavorite = true;

        if (user.is_in_favorite_list == true) {
            user.is_in_favorite_list = false;
            var url = this.api.url + '/user/managelists/favi/0/' + this.user.userId;
            var message = 'משתמש הוסר בהצלחה מהמועדפים';
            var params = JSON.stringify({
                list: 'Unfavorite'
            });
        } else {
            user.is_in_favorite_list = true;

            var params = JSON.stringify({
                list: 'Favorite'
            });

            var url = this.api.url + '/user/managelists/favi/1/' + this.user.userId;
            var message = 'משתמש הוסף בהצלחה למועדפים';
        }

        let toast = this.toastCtrl.create({
            message: user.nickName + ' ' + message,
            duration: 2000
        });

        console.log(url);

        toast.present();

        this.http.post(url, params, this.api.setHeaders(true)).subscribe(data => {
            console.log(data);
        });
    }

    blockSubmit() {
        var action;
        if (this.user.is_in_black_list == true) {
            this.user.is_in_black_list = false;
            action = 'delete';
        } else {
            this.user.is_in_black_list = true;
            action = 'create';
        }

        let params = JSON.stringify({
            list: 'BlackList',
            action: action
        });

        var act = this.user.is_in_black_list == 1 ? 1 : 0;

        this.http.post(this.api.url + '/user/managelists/black/' + act + '/' + this.user.userId, params, this.api.setHeaders(true)).subscribe(data => {
            let toast = this.toastCtrl.create({
                message: data.json().success,
                duration: 3000
            });

            toast.present();

        });
    }

    addLike(user) {
        user.isAddLike = true;
        let toast = this.toastCtrl.create({
            message: ' עשית לייק ל' + user.nickName,
            duration: 2000
        });

        toast.present();

        let params = JSON.stringify({
            toUser: user.userId,
        });

        this.http.post(this.api.url + '/user/like/' + user.userId, params, this.api.setHeaders(true)).subscribe(data => {
            console.log(data);
        }, err => {
            console.log("Oops!");
        });
    }

    fullPagePhotos() {
        if (this.user.photos[0].url != 'http://www.richdate.co.il/images/users/small/0.jpg') {
            this.navCtrl.push(FullScreenProfilePage, {
                user: this.user
            });
        }
    }

    toDialog(user) {
        this.navCtrl.push(DialogPage, {
            user: user
        });
    }

    reportAbuseShow() {
        this.isAbuseOpen = true;
        this.scrollToBottom();
    }

    reportAbuseClose() {
        this.isAbuseOpen = false;
        this.formReportAbuse.text.value = "";
    }

    abuseSubmit() {

        let params = JSON.stringify({
            abuseMessage: this.formReportAbuse.text.value,
        });

        this.http.post(this.api.url + '/user/abuse/' + this.user.userId, params, this.api.setHeaders(true)).subscribe(data => {

            let toast = this.toastCtrl.create({
                message: 'הודעתך נשלחה בהצלחה להנהלת האתר',
                duration: 2000
            });

            toast.present();
        }, err => {
            console.log("Oops!");
        });
        this.reportAbuseClose();
    }

    ionViewDidLoad() {
        //console.log(this.user);
    }

    ionViewWillLeave() {
        console.log('ionViewWillLeave');
        $('.back-btn').hide();
    }

    ionViewCanLeave() {
        console.log('ionViewWillLeave');

    }

        ionViewWillEnter() {
        this.api.pageName = 'ProfilePage';
        $('.back-btn').show();
    }

}
