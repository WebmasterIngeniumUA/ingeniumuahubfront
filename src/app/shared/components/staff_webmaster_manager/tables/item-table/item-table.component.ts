import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {RolesService} from '@ingenium/app/core/services/user/roles.service';
import {HubUserRolesI} from '../../../../models/user';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  imports: [
    MatTableModule,
    NgIf,
    RouterLink,
    DatePipe,
    AsyncPipe
  ],
  standalone: true
})
export class ItemTableComponent implements OnInit {

  @Input() itemTypeInput: string | null = null;
  userRoles$ = this.roleService.getRoles();
  items$: Observable<ItemWideI[]> = of([]);

  constructor(private itemService: ItemWideService,
              private roleService: RolesService) {
  }

  ngOnInit() {
    this.items$ = this.itemService.getItems();
  }

  public GetDisplayedColumns(roles: HubUserRolesI): string[] {
    const displayed_columns = ['name', 'available', 'disabled', 'created_at', 'modified_at'];
    if (roles.is_manager || roles.is_webmaster) {
      displayed_columns.splice(0, 0, 'uuid'); // TODO Add 'disabled' here
    }
    return displayed_columns;
  }
}
