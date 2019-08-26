import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, ToastController, Events, InfiniteScroll} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {ProfilePage} from "../profile/profile";
import {LoginPage} from "../login/login";
import {DialogPage} from "../dialog/dialog";

import * as $ from "jquery";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild(InfiniteScroll) scroll: InfiniteScroll;

    public loadMoreResults: any = true;
    public options: { filter: any } = {filter: 1};
    list: any;
    action: any;
    offset: any;
    page_counter: any;
    loader: any = true;
    username: any;
    password: any;
    blocked_img: any = false;
    user_counter: any = 0;
    form_filter: any;
    filter: any; //= {filter: '', visible: ''}
    users: any;//Array<{ id: string, isOnline: string, isAddBlackListed: string, nickName: string, photo: string, age: string, region_name: string, image: string, about: {}, component: any}>;
    texts: { like: string, add: string, message: string, remove: string, unblock: string, no_results: string };
    params: any
        = {
        action: 'online',
        filter: 'photo',
        resultsPerPage: 20,
        page: 1,
        list: '',
        searchparams: {region: '', agefrom: 0, ageto: 0, sexpreef: '', meritalstat: '', userNick: ''}
    };
    params_str: any;
    scrolling = false;
    selectOptions = {title: 'popover select'};

    constructor(public toastCtrl: ToastController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public events: Events) {

        if (navParams.get('params') && navParams.get('params') != 'login') {

            if (navParams.get('action')) {
                this.params_str = {
                    action: 'list',
                    list: navParams.get('params').list,
                    page: 1
                }
            }

            this.params_str = navParams.get('params');
            this.params = JSON.parse(this.params_str);
        }

        if (!navParams.get('params') || navParams.get('params') == 'login') {
            this.api.setLocation();
            this.api.sendBrowserPhoneId();
        }

        this.params.resultsPerPage = this.api.resultsPerPage;
        this.params_str = JSON.stringify(this.params);

        // If Current Page Is "Block" or "Favorited", than remove "Add Favorited"
        if (this.params.list == 'black' || this.params.list == 'fav') {
            this.blocked_img = true;
        }

        this.page_counter = 1;

        this.api.storage.get('username').then((username) => {
            this.api.storage.get('password').then((password) => {
                this.password = password;
                this.username = username;
                this.getUsers();
            });
        });

        //this.getLocation();
    }

    itemTapped(user) {
        this.navCtrl.push(ProfilePage, {
            user: user,
            id: user.id
        });
    }

    filterStatus() {
        if (this.options.filter == 1) {
            this.options.filter = 0;
        } else {
            this.options.filter = 1;
        }

        console.log(this.options.filter);
    }

    toDialog(user) {
        this.navCtrl.push(DialogPage, {
            user: user
        });
    }

    addLike(user) {

        //console.log('USER: ' + JSON.stringify(user.userNick));

        if (user.isLike == '0') {
            this.users[this.users.indexOf(user)].isLike = '1';
            user.isLike = '1';

            let toast = this.toastCtrl.create({
                message: ' עשית לייק ל' + user.nickName,
                duration: 5000
            });

            toast.present();

            let params = JSON.stringify({
                toUser: user.id,
            });

            this.api.http.post(this.api.url + '/user/like/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
            }, err => {
                console.log("Oops!");
            });
        }
    }

    block(user, bool) {

        let toast;
        let params;

        if (bool == false) {

            params = JSON.stringify({
                list: 'BlackList',
                action: 'delete'
            });
        }

        if (this.users.length == 1) {
            this.user_counter = 0;
        }

        // Remove user from list
        this.users.splice(this.users.indexOf(user), 1);
        this.events.publish('statistics:updated');


        this.api.http.post(this.api.url + '/user/managelists/black/0/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {

            toast = this.toastCtrl.create({
                message: data.json().success,
                duration: 3000
            });
            toast.present();
        });
    }

    unFavorites(user) {

        let params = JSON.stringify({
            list: 'Unfavorite'
        });

        this.api.http.post(this.api.url + '/user/managelists/favi/0/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
            let toast = this.toastCtrl.create({
                message: data.json().success,
                duration: 3000
            });

            toast.present();
            this.users.splice(this.users.indexOf(user), 1);
            this.events.publish('statistics:updated');
        });

    }

    /* addFavorites(user) {

     if (user.isFav == false) {
     user.isFav = true;


     let params = JSON.stringify({
     list: 'Favorite'
     });

     this.api.http.post(this.api.url + '/user/managelists/favi/1/'+ user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
     let toast = this.toastCtrl.create({
     message: data.json().success,
     duration: 3000
     });

     toast.present();
     this.events.publish('statistics:updated');
     });
     }
     }*/

    addFavorites(user) {
        let params, url;
        let index = this.users.indexOf(user);
        if (this.params.list == 'fav') {
            this.users.splice(index, 1);
        }


        if (user.isFav == '0') {
            this.users[index].isFav = '1';
            user.isFav = '1';
            params = JSON.stringify({
                list: 'Favorite'
            });

            url = this.api.url + '/user/managelists/favi/1/' + user.id;

        } else {

            this.users[index].isFav = '0';
            user.isFav = '0';
            params = JSON.stringify({
                list: 'Unfavorite'
            });

            url = this.api.url + '/user/managelists/favi/0/' + user.id;
        }

        this.api.http.post(url, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
            let toast = this.toastCtrl.create({
                message: data.json().success,
                duration: 3000
            });

            toast.present();
            this.events.publish('statistics:updated');
        });
    }

    sortBy() {

        let params = JSON.stringify({
            action: 'search',
            list: '',
            filter: this.filter,
            page: 1,
            searchparams: {
                region: this.params.searchparams.region,
                agefrom: this.params.searchparams.agefrom,
                ageto: this.params.searchparams.ageto,
                sexpreef: this.params.searchparams.sexpreef,
                meritalstat: this.params.searchparams.meritalstat,
                userNick: this.params.searchparams.userNick
            }

        });

        if (this.params.list) {
            params = JSON.stringify({
                action: '',
                list: this.params.list,
                filter: this.filter,
                page: 1,
                searchparams: {
                    region: this.params.searchparams.region,
                    agefrom: this.params.searchparams.agefrom,
                    ageto: this.params.searchparams.ageto,
                    sexpreef: this.params.searchparams.sexpreef,
                    meritalstat: this.params.searchparams.meritalstat,
                    userNick: this.params.searchparams.userNick
                }
            })
        }

        this.navCtrl.push(HomePage, {
            params: params
        })
    }


    getUsers() {

        this.api.showLoad();

        if (this.navParams.get('params') == 'login') {
            //loading.present();
            this.username = this.navParams.get('username');
            this.password = this.navParams.get('password');

            this.api.http.post(this.api.url + '/users/search/', this.params_str, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
                this.api.hideLoad();
                this.users = data.json().users.items;
                this.texts = data.json().texts;
                this.user_counter = data.json().users.items.length;
                this.form_filter = data.json().filters;
                this.filter = data.json().filter;
                if (data.json().users.items.length < this.params.resultsPerPage) {
                    this.loader = false;
                }
              $(window).resize();
                //this.setDistanceFormat();
            }, err => {
                this.api.hideLoad();

                if (err.status == 403) {
                    if (this.api.pageName != 'LoginPage' && this.api.status != 'block') {
                        this.api.status = 'block';
                        this.api.setHeaders(false, null, null);
                        // Removing data storage
                        this.api.storage.remove('user_data');
                        this.api.storage.remove('username');
                        this.api.storage.remove('password');
                        this.api.storage.remove('status');
                        this.api.storage.remove('user_id');
                        this.api.storage.remove('user_photo');
                        this.navCtrl.setRoot(LoginPage, {error: err.error});
                        this.navCtrl.popToRoot();
                    }
                }
            });
        } else {
            //alert(this.params_str);
            this.api.showLoad();

            this.api.http.post(this.api.url + '/users/search/', this.params_str, this.api.setHeaders(true)).subscribe(data => {
                this.api.hideLoad();
                this.users = data.json().users.items;
                this.texts = data.json().texts;
                this.user_counter = data.json().users.items.length;
                this.form_filter = data.json().filters;
                this.filter = data.json().filter;

                if (data.json().users.items.length < this.params.resultsPerPage) {
                    this.loader = false;
                }
                //this.setDistanceFormat();
            }, err => {
                this.api.hideLoad();

                if (err.status == 403) {
                    //if(val.status != resp.status){
                    //                         this.status = val.status = resp.status;
                    //                         val.userIsPaying = resp.userIsPaying;
                    //                         this.api.storage.set('user_data', val);
                    //                     }
                    if (this.api.pageName != 'LoginPage' && this.api.status != 'block') {
                        this.api.status = 'block';
                        this.api.setHeaders(false, null, null);
                        // Removing data storage
                        this.api.storage.remove('user_data');
                        this.api.storage.remove('username');
                        this.api.storage.remove('password');
                        this.api.storage.remove('status');
                        this.api.storage.remove('user_id');
                        this.api.storage.remove('user_photo');
                        this.navCtrl.setRoot(LoginPage, {error: err.error});
                        this.navCtrl.popToRoot();
                    }
                }
            });
        }
    }


    moreUsers(infiniteScroll: any) {
        if (this.loader) {
            this.page_counter++;
            this.params.page = this.page_counter;
            this.params_str = JSON.stringify(this.params);

            if (this.loadMoreResults) {
                this.loadMoreResults = false;
                this.api.http.post(this.api.url + '/users/search/', this.params_str, this.api.setHeaders(true)).subscribe(data => {
                    this.loadMoreResults = true;
                    if (data.json().users.items.length < this.params.resultsPerPage) {
                        this.loader = false;
                    }
                    for (let person of data.json().users.items) {
                        this.users.push(person);
                    }
                    //this.setDistanceFormat();
                });

            }
            infiniteScroll.complete();
        }
    }

    onScroll(event) {
        //this.scrolling = true;
        //this.scrolling = true;
        //$('.my-invisible-overlay').show();
        console.log('scroll');

    }

    endscroll(event) {
        var that = this;
        console.log('scrollend ' + this.scrolling);
        setTimeout(function () {
            //$('.my-invisible-overlay').hide();
            that.scrolling = false;
            console.log('scrollend');
        }, 4000);

    }

    ionViewWillEnter() {
        this.api.pageName = 'HomePage';
        $('.back-btn').hide();
      // setTimeout(
      //   function () {
      //     $(window).resize();
      //   },1000
      // );
    }


}
