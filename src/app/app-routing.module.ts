import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from "./features/public/homepage/homepage.component";
import {NotfoundpageComponent} from "./features/notfoundpage/notfoundpage.component";
import {RecSysFormComponent} from "./features/recsysform/rec-sys-form.component";
import {AccountComponent} from "./features/public/user/account.component";
import {PublicRoutingComponent} from "./features/public/public-routing/public-routing.component";

const routes: Routes = [
  {path: '',
  component: PublicRoutingComponent,
  children: [
    // Homepage
    {path: '', component: HomepageComponent },
    {path: 'home', component: HomepageComponent }, // For routing to homepage (makes it easier)

    // Authentication pages
    {path: 'auth', loadChildren: () => import('src/app/features/public/auth/auth.model').then(x => x.AuthModule)},
    // Public event related pages
    {path: 'event', loadChildren: () => import('src/app/features/public/events/event.model').then(x => x.EventModule)},
    // User specific pages
    {path: 'user', component: AccountComponent},
  ]},
  //** Employee **//

  //** Webmaster **//

  //** Manager **//

  // Temporary Recsysform
  {path: 'recsysform', component: RecSysFormComponent },

  // Not found as last
  {path: '**', component: NotfoundpageComponent}
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
