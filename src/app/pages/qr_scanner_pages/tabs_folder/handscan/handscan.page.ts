import {Component, ViewChild} from '@angular/core';
import {IonInput, NavController, Platform} from "@ionic/angular";
import {eventDict, selectedEvent, GetEventsService} from "@app_services/qr-scanner_services/get-events.service";
import {currentPage, PageTrackingService, pageTree} from "@app_services/page-tracking.service";
import {PriceDict, PricesService} from "@app_services/qr-scanner_services/prices.service";
import {BlueprintsService} from "@app_services/qr-scanner_services/blueprints.service";


@Component({
  selector: 'app-handscan',
  templateUrl: 'handscan.page.html',
  styleUrls: ['handscan.page.scss']
})
export class HandscanPage {
  @ViewChild('qr_text') qr_text!: IonInput;
  public selectedItem = selectedEvent
  public events: any = undefined
  public inputCode: string = ""
  public actualEventSelected: boolean = false

  public showChooseEvent: boolean = true

  constructor(private navCtrl: NavController,
              private eventSetter: GetEventsService,
              private pageTrackService: PageTrackingService,
              public prices: PricesService,
              public blueprints: BlueprintsService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (pageTree[pageTree.length-2] === 'login') {
        this.ReturnToHome()
      } else {
        this.pageTrackService.popFromTree()
        this.navCtrl.navigateRoot('/'+currentPage).then()
      }
    });
  }

  public ionViewWillEnter() {
    this.qr_text.setFocus().then();
    this.events = Object.keys(eventDict)
    this.selectedItem = selectedEvent
    if (this.selectedItem !== undefined) {this.showChooseEvent = false}
    this.actualEventSelected = !(this.selectedItem === undefined || this.selectedItem === 'Alle evenementen');
  }

  public ReturnToHome() {
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  public Validate() {
    HandCode = this.inputCode
    if (Object.keys(PriceDict).length === 0 || PriceDict[eventDict[this.selectedItem]] === -1) {
      this.pageTrackService.addToTree("prices")
      this.navCtrl.navigateRoot('/prices').then()
    } else {
      this.pageTrackService.addToTree("result")
      this.navCtrl.navigateRoot('/result').then()
    }
  }

  public onItemSelection($selection: any) {
    if ( $selection != undefined) {
      this.selectedItem = $selection.detail.value;
      this.eventSetter.setEvent($selection.detail.value)
      this.showChooseEvent = false
      this.actualEventSelected = !(this.selectedItem === undefined || this.selectedItem === 'Alle evenementen');
    }
  }

  public SetBlueprints(){
    this.navCtrl.navigateRoot('/blueprints').then()
    this.pageTrackService.addToTree("blueprints")
  }

}

export let HandCode: string
