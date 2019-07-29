import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Nav, ToastController, Content} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {FullScreenProfilePage} from "../full-screen-profile/full-screen-profile";
import {DialogPage} from "../dialog/dialog";
import * as $ from "jquery";
import {RegisterPage} from "../register/register";
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

    user: any = { currentUser: true };

    texts: any = {lock: '', unlock: ''};

    formReportAbuse: any =
    {title: '', buttons: {cancel: '', submit: ''}, text: {label: '', name: '', value: ''}};

    myId: any = false;

    imageClick: boolean = false;


    constructor(public toastCtrl: ToastController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery) {
        this.api.pageName = 'ProfilePage';

        var user = navParams.get('user');
        let userId = navParams.get('id');

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
            this.api.storage.get('username').then((username) => {
                this.api.storage.get('password').then((password) => {

                    this.api.http.get(api.url + '/user/profile/' + this.user.id, api.setHeaders(true,username,password)).subscribe(data => {
                        this.user = data.json();
                        this.formReportAbuse = data.json().formReportAbuse;
                        this.texts = data.json().texts;
                        this.api.hideLoad();
                        this.imageClick = true;
                    });
                });
            });
        } else {

            this.api.storage.get('user_id').then((val) => {
                if (val) {
                    this.myId = val;
                    this.api.http.get(api.url + '/user/profile/' + this.myId, api.setHeaders(true)).subscribe(data => {
                        this.user = data.json();

                        this.formReportAbuse = data.json().formReportAbuse;
                        this.texts = data.json().texts;
                        this.api.hideLoad();
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

    addFavorites() {
        // this.user.isAddFavorite = true;

        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
            let url, message, params;
            if (this.user.is_in_favorite_list == true) {
                this.user.is_in_favorite_list = false;
                url = this.api.url + '/user/managelists/favi/0/' + this.user.userId;
                message = 'משתמש הוסר בהצלחה מהמועדפים';
                params = JSON.stringify({
                    list: 'Unfavorite'
                });
            } else {
                this.user.is_in_favorite_list = true;

                params = JSON.stringify({
                    list: 'Favorite'
                });

                url = this.api.url + '/user/managelists/favi/1/' + this.user.userId;
                message = 'משתמש הוסף בהצלחה למועדפים';
            }

            let toast = this.toastCtrl.create({
                message: this.user.nickName + ' ' + message,
                duration: 2000
            });

            console.log(url);

            toast.present();

            this.api.http.post(url, params, this.api.setHeaders(true)).subscribe(data => {
                console.log(data);
            });
        }
    }

    blockSubmit() {
        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
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

            this.api.http.post(this.api.url + '/user/managelists/black/' + act + '/' + this.user.userId, params, this.api.setHeaders(true)).subscribe(data => {
                let toast = this.toastCtrl.create({
                    message: data.json().success,
                    duration: 3000
                });

                toast.present();

            });
        }
    }

    addLike() {
        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
            this.user.isAddLike = true;
            let toast = this.toastCtrl.create({
                message: ' עשית לייק ל' + this.user.nickName,
                duration: 2000
            });

            toast.present();

            let params = JSON.stringify({
                toUser: this.user.userId,
            });

            this.api.http.post(this.api.url + '/user/like/' + this.user.userId, params, this.api.setHeaders(true)).subscribe(data => {
                console.log(data);
            }, err => {
                console.log("Oops!");
            });
        }
    }

    fullPagePhotos() {
        //alert(this.user.currentUser == false);
        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
            if (this.user.photos[0].url != 'http://www.richdate.co.il/images/users/small/0.jpg') {
                this.navCtrl.push(FullScreenProfilePage, {
                    user: this.user
                });
            }
        }
    }

    toDialog() {
        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
            this.navCtrl.push(DialogPage, {
                user: this.user
            });
        }
    }

    reportAbuseShow() {
        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
            this.isAbuseOpen = true;
            this.scrollToBottom();
        }
    }

    reportAbuseClose() {
        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
            this.isAbuseOpen = false;
            this.formReportAbuse.text.value = "";
        }
    }

    abuseSubmit() {
        if(!this.user.currentUser){
            this.navCtrl.push(RegisterPage);
        }
        else {
            let params = JSON.stringify({
                abuseMessage: this.formReportAbuse.text.value,
            });

            this.api.http.post(this.api.url + '/user/abuse/' + this.user.userId, params, this.api.setHeaders(true)).subscribe(data => {

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
    }

    ionViewDidLoad() {
        //console.log(this.user);
    }

    ionViewWillLeave() {
        console.log('ionViewWillLeave');
        $('.back-btn').hide();
    }

    ionViewWillEnter() {
        this.api.pageName = 'ProfilePage';
        $('.back-btn').show();
    }

}
