import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, ToastController} from "@ionic/angular";
import {scannedQr} from "../tabs_folder/scan/scan.page";
import {GetQrDataService, QrData} from "@app_services/qr-scanner_services/get-qr-data.service";
import {eventDict, selectedEvent} from "@app_services/qr-scanner_services/get-events.service";
import {currentPage, pageTree, PageTrackingService} from "@app_services/page-tracking.service";
import {HandCode} from "../tabs_folder/handscan/handscan.page";
import {TransactionPatcherService} from "@app_services/qr-scanner_services/transaction-patcher.service";
import {HistoryUpdaterService} from "@app_services/qr-scanner_services/history-updater.service";
import {disableSound, doAutoReturn, returnTime} from "../tabs_folder/settings/settings.page";
import {NativeAudio} from "@capgo/native-audio";
import {CheckUserService} from "@app_services/qr-scanner_services/check-user.service";
import {blueprintsDict} from "@app_services/qr-scanner_services/blueprints.service";


@Component({
  selector: 'app-result',
  templateUrl: 'result.page.html',
  styleUrls: ['result.page.scss']
})
export class ResultPage {
  @ViewChild('More') moreModal: any;
  @ViewChild('userChange') userChangeModal: any;

  public UserEmail: string = ""
  public UserLidstatus: string = ""
  public UserGeldigheid: string = ""
  public UserStatus: string = ""
  public UserItem: string = ""
  public UserId: string = ""
  public UserNotes: string = ""
  public UserOwed: string = ""
  public UserBlueprint: string = ""
  public UserPolicyName: string = ""

  private savedResult: QrData | undefined = undefined

  public imgPath: string = "../../../../assets/qr-scanner/sync.png"
  public ModalEnabled: boolean = true

  private code: string = ""

  public selectedValidity: string = ""
  public inputEmail: string = ""
  public showError:boolean = false
  public errorText: string = ""

  public toast: HTMLIonToastElement | null = null

  constructor(private navCtrl: NavController,
              private toastCtrl: ToastController,
              private QrService: GetQrDataService,
              private historyAdder: HistoryUpdaterService,
              private patcher: TransactionPatcherService,
              private userChecker: CheckUserService,
              private pageTrackService: PageTrackingService,
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
    if (pageTree[pageTree.length-2] === "tabs/scan") {this.code = scannedQr} else if (pageTree[pageTree.length-2] === "tabs/handscan") {this.code = HandCode}
    this.QrService.getQrData(eventDict[selectedEvent], this.code).then((result) => {
      if (typeof result === "string") {
        if (result === "server_error") {
          this.pageTrackService.setTreeToRoot()
          this.navCtrl.navigateRoot('').then()
        } else if (result === "no_event") {
          this.Back()
        } else {
          this.loadElements(false).then()
        }
      } else {
        this.savedResult = result
        this.loadElements(true, result.validity, result).then()
      }
    })
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(
      (resolve) => setTimeout(resolve, ms));
  }

  private async loadElements(Succeeded: boolean, validity: string = "", result: QrData | undefined = undefined, runAutoValidate: boolean = true) {
    if (Succeeded) {
      this.ModalEnabled = true
      if (typeof result !== "undefined") {
        this.UserEmail = result.email
        this.UserLidstatus = result.lidStatus
        this.UserGeldigheid = result.validity
        this.UserStatus = result.checkoutStatus
        this.UserItem = result.productString
        this.UserId = result.id
        this.UserNotes = result.notes
        this.UserOwed = result.toPay
        this.UserBlueprint = result.blueprintName
        this.UserPolicyName = result.pricePolicyName
        if (this.UserItem.length)

        if (blueprintsDict[selectedEvent] !== undefined) {
          if (!blueprintsDict[selectedEvent][this.UserBlueprint]) {
            validity = "consumed"
            this.UserGeldigheid = "consumed"
            if (this.UserNotes === "") {
              this.UserNotes = "Product blueprint in blacklist"
            } else {
              this.UserNotes = this.UserNotes + ", Product blueprint in blacklist"
            }
          }
        }

        if (this.UserNotes !== "") {this.showToast().then();}
      }
      if (validity === "valid") {
        this.imgPath = "../../../../assets/qr-scanner/checkmark.png"
        if (runAutoValidate) {
          this.AutoValidate(this.UserId)
          if (!disableSound) {await this.playAudio("oneBeep")}
        }
        if (doAutoReturn) {
          await this.sleep(returnTime*1000)
          this.Back()
        }
      } else if (validity === "invalid") {
        this.imgPath = "../../../../assets/qr-scanner/dashmark.png"
        if (!disableSound) {await this.playAudio("twoBeep")}
      } else {
        this.imgPath = "../../../../assets/qr-scanner/xmark.png"
        if (!disableSound) {await this.playAudio("longBeep")}
      }

    } else {
      this.imgPath = "../../../../assets/qr-scanner/xmark.png"
      this.ModalEnabled = false
    }
  }

  async playAudio(soundId: string) {
    try {
      await NativeAudio.play({
        assetId: soundId
      })
    } catch (e) {
      console.log(e)
    }
  }

  async showToast() {
    this.toast = await this.toastCtrl.create({
      message: this.UserNotes,
      swipeGesture: "vertical",
      position: 'middle'
    });
    this.toast.present().then()
  }

  public Back() {
    if (this.toast !== null) {this.toast.dismiss}
    if (currentPage === "result") {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/' + currentPage).then()
    }
  }

  public ReturnToHome() {
    if (this.toast !== null) {this.toast.dismiss}
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  closeMoreModal() {
    this.moreModal.dismiss(null, 'cancel').then();
  }

  closeUserChangeModal() {
    this.userChangeModal.dismiss(null, 'cancel').then();
  }

  public onItemSelection($selection: any) {
    if ( $selection != undefined) {
      this.selectedValidity = $selection.detail.value;
    }
  }

  public customPopoverOptions = {
    side: "top"
  };

  public UpdateValidity() {
    if (typeof this.selectedValidity !== "undefined") {
      this.patcher.PatchTransaction(+this.UserId, this.selectedValidity)
        .then((result) => {
        if (result === "server_error") {
          this.pageTrackService.setTreeToRoot()
          this.navCtrl.navigateRoot('').then()
        } else {
          this.loadElements(true, this.selectedValidity, this.savedResult, false).then()
          this.UserGeldigheid = this.selectedValidity
          this.addToHistory(selectedEvent, this.UserEmail,"Geldigheid aangepast naar "+this.selectedValidity, eventDict[selectedEvent])
          this.closeMoreModal()
        }
      })
    }
  }

  private AutoValidate(interactionID: string) {
    this.patcher.PatchTransaction(+interactionID, "consumed")
      .then((result) => {
        if (result === "server_error") {
          this.pageTrackService.setTreeToRoot()
          this.navCtrl.navigateRoot('').then()
        } else {
          this.addToHistory(selectedEvent, this.UserEmail, "Automatisch gevalideerd", eventDict[selectedEvent])
          this.UserGeldigheid = "consumed"
        }
      })
  }

  public UpdateUser() {
    this.showError = false
    if (this.inputEmail !== "") {
      this.userChecker.checkUser(this.inputEmail.toLowerCase()).then((result) => {
        if (result === "user_not_found") {
          this.showError = true
          this.errorText = "Dit email adres werd niet gevonden"
        } else if (result === "server error") {
          this.pageTrackService.setTreeToRoot()
          this.navCtrl.navigateRoot('').then()
        } else {
          if (result["lid"]) {
            this.patcher.PatchTransaction(+this.UserId, "valid", this.inputEmail.toLowerCase()).then(() => {
              this.ionViewWillEnter()
            })
          } else {
            this.patcher.PatchTransaction(+this.UserId, "invalid", this.inputEmail.toLowerCase()).then(() => {
              this.ionViewWillEnter()
            })
          }
          this.addToHistory(selectedEvent, this.UserEmail, "Tickethouder van " + this.UserEmail + " naar " + this.inputEmail + " aangepast", eventDict[selectedEvent])
        }
      })
      this.closeUserChangeModal()
    } else {
    this.showError = true
    this.errorText = "Geef een email adres op"
    }
  }

  public InvalidValidate() {
    this.patcher.PatchTransaction(+this.UserId, "consumed")
      .then((result) => {
        if (result === "server_error") {
          this.pageTrackService.setTreeToRoot()
          this.navCtrl.navigateRoot('').then()
        } else {
          this.addToHistory(selectedEvent, this.UserEmail, "Invalid gevalideerd", eventDict[selectedEvent])
          this.UserGeldigheid = "consumed"
          this.imgPath = "../../../../assets/qr-scanner/checkmark.png"
          this.closeMoreModal()
          if (doAutoReturn) {
            this.sleep(returnTime*1000)
            this.Back()
          }
        }
      })
  }

  private addToHistory(event: string, email: string, aanpassing: string, uuid: string) {
    this.historyAdder.updateHistory([event, email, aanpassing, uuid])
  }

}