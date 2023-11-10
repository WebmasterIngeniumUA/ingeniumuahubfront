import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebmasterComponent } from './webmaster.component';
import {WebmasterRoutingModule} from "./webmaster-routing.module";
import {BehindheaderComponent} from "../../core/layout/behind/behindheader/behindheader.component";
import {SidenavComponent} from "../../core/layout/behind/sidenav/sidenav.component";
import { UsersListComponent } from './user/users-list/users-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { GroupListComponent } from './user/group-list/group-list.component';
import {
  GroupTableComponent
} from "../../shared/components/staff_webmaster_manager/tables/group-table/group-table.component";
import {PublicHeaderComponent} from "../../core/layout/public/header/public-header.component";
import {
    UserTableComponent
} from "../../shared/components/staff_webmaster_manager/tables/user-table/user-table.component";
import { ItemDashboardComponent } from './item/item-dashboard/item-dashboard.component';
import {
    ItemTableComponent
} from "../../shared/components/staff_webmaster_manager/tables/item-table/item-table.component";
import { ItemDetailDashboardComponent } from './item/item-detail-dashboard/item-detail-dashboard.component';
import {
  StaffItemDetailComponent
} from "../../shared/components/staff_webmaster_manager/details/staff-item-detail/staff-item-detail.component";
import {
    StaffUserDetailComponent
} from "../../shared/components/staff_webmaster_manager/details/staff-user-detail/staff-user-detail.component";
import { CardDashboardComponent } from './item/card-dashboard/card-dashboard.component';
import {
  CardTableComponent
} from "../../shared/components/staff_webmaster_manager/tables/card-table/card-table.component";
import {
    TransactionTableComponent
} from "../../shared/components/staff_webmaster_manager/tables/transaction-table/transaction-table.component";



@NgModule({
  declarations: [
    WebmasterComponent,
    UsersListComponent,
    UserDetailComponent,
    GroupListComponent,
    ItemDashboardComponent,
    ItemDetailDashboardComponent,
    CardDashboardComponent,
  ],
    imports: [
        CommonModule,
        WebmasterRoutingModule,
        BehindheaderComponent,
        SidenavComponent,
        GroupTableComponent,
        PublicHeaderComponent,
        UserTableComponent,
        ItemTableComponent,
        StaffItemDetailComponent,
        StaffUserDetailComponent,
        CardTableComponent,
        TransactionTableComponent,
    ]
})
export class WebmasterModule { }
