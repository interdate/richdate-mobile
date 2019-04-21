import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import {Page} from "../page/page";
import * as $ from 'jquery';

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-subscription',
    templateUrl: 'subscription.html',
})
export class SubscriptionPage {

    public dataPage: any;
    is_showed: any;
    checkStatus: any;
    action: any;
    products: any = [];
    public coupon: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public api: ApiQuery) {

        this.getPage();
    }

    page(pageId) {
        this.navCtrl.push(Page, {pageId: pageId});
    }

    goto(product) {
        this.api.showLoad();
        var that = this;
        this.action = product.url;
        //window.open(product.url, '_blank');
        setTimeout(function () {
            $('#telepay').submit();
            that.api.hideLoad();
        }, 100);
    }

    getPage() {

        //alert(this.coupon);
        this.api.showLoad();
        let coupon = !this.coupon ? '0' : this.coupon;
        this.coupon = '';
        this.http.get(this.api.url + '/user/subscriptions/' + coupon + '?mobile=1', this.api.setHeaders(true)).subscribe((data:any) => {

            this.products = data.json().subscription.payments;
            this.dataPage = data.json().subscription;

                this.api.hideLoad();
        });
    }

    ionViewDidLoad() {
        this.api.pageName = 'SubscriptionPage';
        console.log('ionViewDidLoad SubscriptionPage');
    }

}
