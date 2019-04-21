import {AngularFireModule} from "angularfire2";
import "firebase/messaging";
import {firebaseConfig} from "../environment";
import {FirebaseMessagingProvider} from "../providers/firebase-messaging";
import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule, Nav} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {ApiQuery} from "../library/api-query";
import {IonicStorageModule} from "@ionic/storage";
import {HttpModule} from "@angular/http";
import {Device} from "@ionic-native/device";
import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";
import {RegisterPageModule} from "../pages/register/register.module";
import {Camera} from "@ionic-native/camera";
import {FileTransfer} from "@ionic-native/file-transfer";
import {PageModule} from "../pages/page/page.module";
import {ChangePhotosPageModule} from "../pages/change-photos/change-photos.module";
import {AdvancedsearchPageModule} from "../pages/advancedsearch/advancedsearch.module";
import {Geolocation} from "@ionic-native/geolocation";
import {SettingsPageModule} from "../pages/settings/settings.module";
import {SubscriptionPageModule} from "../pages/subscription/subscription.module";
import {AdvancedSearchResultPageModule} from "../pages/advanced-search-result/advanced-search-result.module";
import {Keyboard} from "@ionic-native/keyboard";
import {AdminMessagesPageModule} from "../pages/admin-messages/admin-messages.module";
import {ProfilePage} from "../pages/profile/profile";
import {SelectPageModule} from "../pages/select/select.module";
import {ActivationPageModule} from "../pages/activation/activation.module";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {HttpClientModule} from "@angular/common/http";
import {InboxPage} from "../pages/inbox/inbox";
import {InboxPageModule} from "../pages/inbox/inbox.module";
import {ArenaPageModule} from "../pages/arena/arena.module";
import {BingoPageModule} from "../pages/bingo/bingo.module";
import {ChangePasswordPageModule} from "../pages/change-password/change-password.module";
import {ContactUsPageModule} from "../pages/contact-us/contact-us.module";
import {DialogPageModule} from "../pages/dialog/dialog.module";
import {FaqPageModule} from "../pages/faq/faq.module";
import {FreezeAccountPageModule} from "../pages/freeze-account/freeze-account.module";
import {FullScreenProfilePageModule} from "../pages/full-screen-profile/full-screen-profile.module";
import {NotificationsPageModule} from "../pages/notifications/notifications.module";
import {PasswordRecoveryPageModule} from "../pages/password-recovery/password-recovery.module";
import {SearchPageModule} from "../pages/search/search.module";
import {DialogPage} from "../pages/dialog/dialog";
import {NotificationsPage} from "../pages/notifications/notifications";
import {SearchPage} from "../pages/search/search";
import {PasswordRecoveryPage} from "../pages/password-recovery/password-recovery";
import {Page} from "../pages/page/page";
import {ContactUsPage} from "../pages/contact-us/contact-us";
import {ArenaPage} from "../pages/arena/arena";
import {RegisterPage} from "../pages/register/register";
import {SubscriptionPage} from "../pages/subscription/subscription";
import {ActivationPage} from "../pages/activation/activation";
import {FullScreenProfilePage} from "../pages/full-screen-profile/full-screen-profile";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ApiQuery,
    ProfilePage
  ],
  exports: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay',
      scrollAssist: false,
      autoFocusAssist: false
    }, {
      links: [
        {component: HomePage, name: 'בית', segment: 'home'},
        {component: ProfilePage, name: 'פרופיל', segment: 'profile/:id', defaultHistory: [HomePage]},
        {
          component: ActivationPage,
          name: 'Activation',
          segment: 'activation/:email/:code',
          defaultHistory: [HomePage]
        },
        {component: DialogPage, name: 'Chat', segment: 'dialog/:id', defaultHistory: [HomePage]},
        {component: FullScreenProfilePage, name: 'Full Screen Profile', segment: 'full-screen-profile', defaultHistory: [HomePage]},
        {component: SubscriptionPage, name: 'Subscription', segment: 'subscription'},
        {component: RegisterPage, name: 'פרופיל שלי', segment: 'edit/:step', defaultHistory: [HomePage]},
        {component: InboxPage, name: 'תיבת הודעות', segment: 'inbox', defaultHistory: [HomePage]},
        {component: ArenaPage, name: 'התיבה', segment: 'hativa', defaultHistory: [HomePage]},
        {component: ContactUsPage, name: 'צור קשר', segment: 'contact-us', defaultHistory: [HomePage]},
        {component: Page, name: 'עמוד', segment: 'page', defaultHistory: [HomePage]},
        {component: PasswordRecoveryPage, name: 'שחזור סיסמה', segment: 'recovery', defaultHistory: [HomePage]},
        //{ component: ResultsPage, name: 'תוצאות', segment: 'results' },
        {component: SearchPage, name: 'חיפוש', segment: 'search', defaultHistory: [HomePage]},
        {component: LoginPage, name: 'כניסה', segment: 'login', defaultHistory: [HomePage]},
        {component: NotificationsPage, name: 'התיבה שלי', segment: 'notifications', defaultHistory: [HomePage]}
      ]
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
    HttpModule,
    RegisterPageModule,
    PageModule,
    SelectPageModule,
    ChangePhotosPageModule,
    InboxPageModule,
    AdvancedsearchPageModule,
    AdvancedSearchResultPageModule,
    SettingsPageModule,
    SubscriptionPageModule,
    AdminMessagesPageModule,
    ActivationPageModule,
    ArenaPageModule,
    BingoPageModule,
    ChangePasswordPageModule,
    ContactUsPageModule,
    DialogPageModule,
    FaqPageModule,
    FreezeAccountPageModule,
    FullScreenProfilePageModule,
    NotificationsPageModule,
    PageModule,
    PasswordRecoveryPageModule,
    RegisterPageModule,
    SearchPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage
  ],
  providers: [
    Nav,
    Keyboard,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Device,
    Geolocation,
    FileTransfer,
    Camera,
    FirebaseMessagingProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiQuery, Media, File
  ]
})
export class AppModule {
}
