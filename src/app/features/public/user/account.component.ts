import {Component, OnInit} from '@angular/core';
import {HubAccountData, HubAuthData, HubAuthGroups} from "../../../shared/models/user";
import {AuthService} from "../../../core/services/user/auth/auth.service";
import {HubaccountService} from "../../../core/services/user/account/hubaccount.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-user',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(protected authService: AuthService,
              private accountService: HubaccountService,
              private httpClient: HttpClient) {
  }

  account?: HubAccountData;
  userauth?: HubAuthData;

  userRoles?: HubAuthGroups;

  ngOnInit(): void {
    this.accountService.getAccount().
    subscribe((data) => {
      this.account = data;})

  this.authService.user.subscribe((data) => {
    if (data) {
      this.userauth = data;}
  })
  }

  RefreshAuth(): void {
    this.authService.refreshAccessToken().subscribe();
  }

  Logout(): void {
    this.authService.logout();
  }

  GetRoles(): void {
    this.httpClient.get<any>("http://127.0.0.1:8000/api/user/roles").subscribe(
      (data) => {
        this.userRoles = data;
      }
    );
  }
}
