import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {DialogPage} from "../dialog/dialog";

/**
 * Generated class for the FullScreenProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-full-screen-profile',
    templateUrl: 'full-screen-profile.html',
})
export class FullScreenProfilePage {

    user: any;
    myId: any;
    defurl: any;

    constructor(public toastCtrl: ToastController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery) {

        this.user = navParams.get('user');

        this.api.storage.get('user_id').then((val) => {

            if (val) {
                this.myId = val;
            }
        });
    }

    goBack() {
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FullScreenProfilePage');
    }

    toDialog() {
        this.navCtrl.push(DialogPage, {
            user: this.user
        });
    }

    addFavorites() {
        let url, message, params;
        if (this.user.is_in_favorite_list == true) {
            this.user.is_in_favorite_list  = false;
            url = this.api.url + '/user/managelists/favi/0/' + this.user.userId;
            message = 'משתמש הוסר בהצלחה מהמועדפים';
            params = JSON.stringify({
                list: 'Unfavorite'
            });
        } else {
            this.user.is_in_favorite_list  = true;

            params = JSON.stringify({
                list: 'Favorite'
            });

            url = this.api.url + '/user/managelists/favi/1/' + this.user.userId;
            message = 'משתמש הוסף בהצלחה למועדפים';
        }

        let toast = this.toastCtrl.create({
            message:  message,
            duration: 2000
        });

        toast.present();

        this.api.http.post(url, params, this.api.setHeaders(true)).subscribe(data => {
            console.log(data);
        });
    }

    addLike() {
        this.user.isAddLike = true;
        let toast = this.toastCtrl.create({
            message: ' עשית לייק ל' + this.user.username,
            duration: 2000
        });

        toast.present();

        let params = JSON.stringify({
            toUser: this.user.id,
        });

        this.api.http.post(this.api.url + '/api/v1/likes/' + this.user.id, params, this.api.setHeaders(true)).subscribe(data => {
            console.log(data);
        }, err => {
            console.log("Oops!");
        });
    }

    ionViewWillEnter() {
        this.api.pageName = 'FullScreenProfilePage';
    }

}
