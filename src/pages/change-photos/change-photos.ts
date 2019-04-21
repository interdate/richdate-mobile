import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    ActionSheetController,
    AlertController,
    LoadingController
} from "ionic-angular";
import {Camera} from "@ionic-native/camera";
import {FileTransfer} from "@ionic-native/file-transfer";
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import {Storage} from "@ionic/storage";
import {HomePage} from "../home/home";
import * as $ from "jquery";
import {TermsPage} from "../terms/terms";


/**
 * Generated class for the ChangePhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-change-photos',
    templateUrl: 'change-photos.html',
    providers: [Camera, FileTransfer]
})
export class ChangePhotosPage {

    image: any;
    photos: any;
    imagePath: any;
    username: any = false;
    password: any = false;
    new_user: any = false;
    gender: any;
    dataPage: { noPhoto: any, texts: any, images: Array<{ _id: string, items: {}, url: string, imgValidated: string, main: string}> };
    description: any;

    constructor(public actionSheetCtrl: ActionSheetController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public http: Http,
                public api: ApiQuery,
                public storage: Storage,
                public loadingCtrl: LoadingController,
                public camera: Camera,
                public  fileTransfer: FileTransfer) {

        if (navParams.get('new_user')) {
            this.new_user = 1;
            this.api.storage.set('new_user', 1);
        }
        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });

        this.storage.get('new_user').then((val) => {
            if (val) {
                this.new_user = val;
            } else {
                this.new_user = false;
            }
        });

        if (navParams.get('username') && navParams.get('password')) {
            this.password = navParams.get('password');
            this.username = navParams.get('username');
        }

        this.getPageData();
        this.image = navParams.get('images');
    }

    delete(photo) {
        let confirm = this.alertCtrl.create({
            title: 'האם למחוק את התמונה?',
            buttons: [
                {
                    text: 'לא',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                }, {
                    text: 'כן',
                    handler: () => {
                        this.postPageData('deleteImage', photo);
                    }
                }
            ]
        });
        confirm.present();
    }


    getCount(num) {
        return parseInt(num) + 1;
    }

    getPageData() {

        this.http.get(this.api.url + '/user/images', this.api.setHeaders(true, this.username, this.password)).subscribe(data => {

            this.dataPage = data.json();
            this.description = data.json().texts.description;
            this.photos = data.json().images.items;
            this.gender = data.json().gender;

        }, err => {
            //alert(JSON.stringify(err));
        });
    }

    getPage(id) {
        this.navCtrl.push(TermsPage, {id: id});
    }

    postPageData(type, params) {//not active
        var data: any;
        if (type == 'setMain') {
            var action = "setMain";
            console.log('Param', params);
            data = JSON.stringify({setMain: params.id});

        } else if ('deletePage') {
            var action = "delete";
            data = JSON.stringify({
                //delete: params.id
            });
        }

        this.http.post(this.api.url + '/user/images/' + action + '/' + params.id, data, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {

            if (type != 'setMain') {
                this.dataPage = data.json();
            } else {
                this.dataPage.images = data.json().images;
            }
            this.photos = data.json().images.items;
            this.getPageData();
        }, err => {
            console.log("Oops!");
        });
    }

    edit(photo) {

        let mainOpt = [];

        if (photo.main == 0) {

            mainOpt.push({
                    text: 'קבע כראשית',
                    icon: 'contact',
                    handler: () => {
                        this.postPageData('setMain', photo);
                    }
                }
            );
        }

        mainOpt.push({
            text: this.dataPage.texts.delete,
            role: 'destructive',
            icon: 'trash',
            handler: () => {
                this.delete(photo);
            }
        });
        mainOpt.push({
            text: this.dataPage.texts.cancel,
            role: 'destructive',
            icon: 'close',
            handler: () => {
                console.log('Cancel clicked');
            }
        });

        var status = photo.isValid == 1 ?
            this.dataPage.texts.approved : this.dataPage.texts.waiting_for_approval;

        let actionSheet = this.actionSheetCtrl.create({
            title: this.dataPage.texts.edit_photo,

            subTitle: this.dataPage.texts.status + ': ' + status,

            buttons: mainOpt
        });
        actionSheet.present();
    }

    add() {

        let actionSheet = this.actionSheetCtrl.create({
            title: this.dataPage.texts.add_photo,
            buttons: [
                //browser option
                {
                    text: 'בחר תמונה',
                    icon: 'photos',
                    handler: () => {
                        //this.openGallery();
                        this.browserUpload()
                    }
                },
                {
                    text: this.dataPage.texts.cancel,
                    role: 'destructive',
                    icon: 'close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    browserUpload() {
        $('#fileLoader').click();
    }

    uploadPhotoInput(fileLoader) {
        // this.api.showLoad('אנא המתן...');
        let that = this;
        let file = fileLoader.files[0];
        let reader = new FileReader();

        if (file) {
            reader.onload = function () {
                that.getOrientation(fileLoader.files[0], function (orientation) {
                    if (orientation > 1) {
                        that.resetOrientation(reader.result, orientation, function (resetBase64Image) {
                            that.uploadPhotoBrowser(resetBase64Image);
                        });
                    } else {
                        that.uploadPhotoBrowser(reader.result);
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    }

    uploadPhotoBrowser(dataUrl) {
        if (dataUrl) {
            let that = this;
            that.api.showLoad('אנא המתן...');
            //resize
            let canvas = document.createElement("canvas");
            let img = document.createElement("img");
            let dataImage = that.getInfoFromBase64(dataUrl);
            img.src = dataUrl;
            img.onload = function () {
                //let ctx = canvas.getContext("2d");
                //ctx.drawImage(img, 0, 0);

                let MAX_WIDTH = 600;
                let MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                dataUrl = canvas.toDataURL(dataImage.mime);

                const blob = that.convertBase64ToBlob(dataUrl);
                const fd = new FormData();

                // Prepare form data to send to server
                fd.append('photo', blob, 'test.jpg');

                let header = {
                    headers: {
                        Authorization: "Basic " + btoa(encodeURIComponent(that.username) + ":" + encodeURIComponent(that.password))
                    }
                };

                //that.api.setHeaders(true);
                that.api.http2.post(that.api.url + '/user/image', fd, header).subscribe((res: any) => {
                    that.getPageData();
                    that.api.hideLoad();
                }, (err) => {
                    console.log(JSON.stringify(err));
                    that.api.hideLoad();
                });
            }
        }
    }

    private convertBase64ToBlob(base64: string) {
        const info = this.getInfoFromBase64(base64);
        const sliceSize = 512;
        const byteCharacters = window.atob(info.rawBase64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new Blob(byteArrays, {type: info.mime});
    }

    private getInfoFromBase64(base64: string) {
        const meta = base64.split(',')[0];
        const rawBase64 = base64.split(',')[1].replace(/\s/g, '');
        const mime = /:([^;]+);/.exec(meta)[1];
        const extension = /\/([^;]+);/.exec(meta)[1];

        return {
            mime,
            extension,
            meta,
            rawBase64
        };
    }

    getOrientation(file, callback) {
        let reader = new FileReader();
        reader.onload = function (e: any) {

            let view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
            let length = view.byteLength, offset = 2;
            while (offset < length) {
                let marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
                    let little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    let tags = view.getUint16(offset, little);
                    offset += 2;
                    for (let i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }

    resetOrientation(srcBase64, srcOrientation, callback) {
        let img = new Image();

        img.onload = function () {
            let width = img.width,
                height = img.height,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext("2d");

            // set proper canvas dimensions before transform & export
            if (4 < srcOrientation && srcOrientation < 9) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }

            // transform context before drawing image
            switch (srcOrientation) {
                case 2:
                    ctx.transform(-1, 0, 0, 1, width, 0);
                    break;
                case 3:
                    ctx.transform(-1, 0, 0, -1, width, height);
                    break;
                case 4:
                    ctx.transform(1, 0, 0, -1, 0, height);
                    break;
                case 5:
                    ctx.transform(0, 1, 1, 0, 0, 0);
                    break;
                case 6:
                    ctx.transform(0, 1, -1, 0, height, 0);
                    break;
                case 7:
                    ctx.transform(0, -1, -1, 0, height, width);
                    break;
                case 8:
                    ctx.transform(0, -1, 1, 0, 0, width);
                    break;
                default:
                    break;
            }

            // draw image
            ctx.drawImage(img, 0, 0);

            // export base64
            callback(canvas.toDataURL());
        };

        img.src = srcBase64;
    }



    safeHtml(el): any {
        let html = this.description;
        let div: any = document.createElement('div');

        return html.innerHTML;

    }

    uploadPhoto(url) {

        let loading = this.loadingCtrl.create({
            content: 'אנא המתן...'
        });

        loading.present();

        this.storage.get('user_id').then((val) => {

            let options = {
                fileKey: "photo",
                fileName: 'test.jpg',
                chunkedMode: false,
                mimeType: "image/jpg",
                headers: {Authorization: "Basic " + btoa(encodeURIComponent(this.username) + ":" + this.password)}/*@*/
            };

            const filetransfer = this.fileTransfer.create();

            filetransfer.upload(url, this.api.url + '/user/image', options).then((entry) => {
                this.navCtrl.push(ChangePhotosPage, {});
                loading.dismiss();
            }, (err) => {
                //alert(JSON.stringify(err));
                loading.dismiss();
            });
        });
    }

    onHomePage() {
        this.storage.remove('new_user');
        this.navCtrl.push(HomePage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangePhotosPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'ChangePhotosPage';
    }
}
