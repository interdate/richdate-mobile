import {Component, ViewChild} from "@angular/core";
import {Content, IonicPage, NavController, NavParams} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {Page} from "../page/page";
import * as $ from 'jquery';
import {InAppBrowser} from "@ionic-native/in-app-browser";

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
    @ViewChild(Content) content: Content;

    public dataPage: any;
    is_showed: any;
    checkStatus: any;
    action: any;
    products: any = [];
    public coupon: any;
    public chooseProduct: any;
    public call: any = 0;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                private iab: InAppBrowser) {

        this.getPage();
    }

    page(pageId) {
        this.navCtrl.push(Page, {pageId: pageId});
    }

    chooseVip(product){
        if(!product.urlVip || product.urlVip == '') {
            this.goto(product, false);
        }else {
            this.chooseProduct = product;
            this.content.scrollToTop(300);
        }
    }

    goto(product, vip = false) {
        delete this.chooseProduct;
        this.content.scrollToTop(300);
        let payUrl = (vip) ? product.urlVip : product.url;
        let browser = this.iab.create(payUrl);

        var that = this;

        let checkStatus = setInterval(
            function(){
                console.log('Payment status: ' + that.api.isPay);
                that.api.http.post(that.api.url + '/user/login/', '', that.api.setHeaders1(true)).subscribe((data: any) => {
                    if(data.isPay == '1') {
                        that.api.isPay = data.isPay;
                        clearInterval(checkStatus);
                        setTimeout(
                            function () {
                                browser.close();
                                $('ion-header .logo').click();
                            }, 3000
                        )
                    }

                }, err => {
                    console.log(err);

                });


            }, 3000);
    }

    backChoose(){
        delete this.chooseProduct;
    }

    getPage() {
        this.call++;
        //alert(this.coupon);
        this.api.showLoad();
        let coupon = !this.coupon ? '0' : this.coupon;
        this.coupon = '';
        this.api.http1.get(this.api.url + '/user/subscriptions/' + coupon + '?mobile=1', this.api.setHeaders1(true)).subscribe((data:any) => {

            delete this.chooseProduct;
            this.products = data.subscription.payments;
            this.dataPage = data.subscription;
            this.api.hideLoad();
        });
    }

    ionViewDidLoad() {
        this.api.pageName = 'SubscriptionPage';
        console.log('ionViewDidLoad SubscriptionPage');
    }

}
