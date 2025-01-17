import {NativeAudio} from "@capgo/native-audio";
import {StorageService} from "./services/qr-scanner_services/storage.service";
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';

import {Component, NgZone, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {App, URLOpenListenerEvent} from "@capacitor/app";
import {PageTrackingService} from "@app_services/page-tracking.service";
import {NavController} from "@ionic/angular";
import {OAuthService} from "angular-oauth2-oidc";
import {apiEnviroment} from "@ingenium/environments/environment";
import {NavigationEnd, Router} from "@angular/router";
import {Store} from "@ngxs/store";
import {User, UserState} from "@ingenium/app/core/store";
import {Subject, takeUntil} from "rxjs";
import {CapacitorHttp} from "@capacitor/core";
import {AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  endSubscription = new Subject();

  constructor(@Inject(PLATFORM_ID) platformId: any, oauthService: OAuthService, private router: Router,
              private store: Store,
              public storage: StorageService,
              private zone: NgZone,
              private pageTrackService: PageTrackingService,
              private navCtrl: NavController,
              private appFunctionsService: AppFunctionsService,) {
    oauthService.configure(apiEnviroment.oauthConfig);
    oauthService.loadDiscoveryDocument().then();
    this.preloadAudio().then();
    this.initializeApp();
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        // Example url: https://ingeniumua.be/tabs/tab2
        // slug = /tabs/tabs
        let slug
        if (event.url.startsWith("ingenium://")) {
          slug = event.url.replace("ingenium://", "")
        } else {
          slug = event.url.replace(/^[a-zA-Z]{3,5}:\/{2}[a-zA-Z0-9_.:-]+\//, '' );
        }
        if (slug === event.url) {slug = ''}  // the link was https://ingeniumua.be which doesn't work as there is no trailing /
        if (slug) {
          console.log(slug)
          this.pageTrackService.addToTree(slug)
          this.navCtrl.navigateRoot(slug).then()
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    }).then();
  }

  async preloadAudio() {
    try{
      let path = 'assets/qr-scanner/sounds/'
      await NativeAudio.preload({
        assetId: "oneBeep",
        assetPath: path + "scansound_one_beep.wav",
        audioChannelNum: 1,
        isUrl: false
      })
      await NativeAudio.preload({
        assetId: "twoBeep",
        assetPath: path + "scansound_two_beeps.wav",
        audioChannelNum: 1,
        isUrl: false
      })
      await NativeAudio.preload({
        assetId: "longBeep",
        assetPath: path + "scansound_long_beep.wav",
        audioChannelNum: 1,
        isUrl: false
      })
    } catch (e) {
      console.log(e)
    }
  }


  ngOnInit(): void {
    // I think this sucks but okay
    // Make sure that on the initial page we don't get the token if we are on the callback page
    this.router.events
      .pipe(
        takeUntil(this.endSubscription)
      )
      .subscribe((e) => {
        if (e instanceof NavigationEnd) {
          // Only get the token if we are not on the callback page
          if (e.url !== '/auth/callback') {
            this.store.dispatch(new User.FetchAuthTokenFromStorage());
          }

          this.endSubscription.next(null);
        }
    });

    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      this.subscribe_to_topic(token.value, "all")
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      this.gotoPage('sub/events')
    });
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

  async subscribe_to_topic(token: string, topic: string) {

    try {
      const param = {
        token: token
      }
      const options = {
        url: apiEnviroment.apiUrl + "item/wide/notification/subscribe/" + topic,
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`, 'Content-Type': "application/json"},
        data: param
      }
      await CapacitorHttp.post(options);

    } catch (error) {
      console.log(error)
    }

  }

}
