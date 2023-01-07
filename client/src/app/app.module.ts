import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { SecurityPrivacyPolicyComponent } from './security-privacy-policy/security-privacy-policy.component';
import { AcceptableUsePolicyComponent } from './acceptable-use-policy/acceptable-use-policy.component';
import { DmcaNoticeTakedownPolicyComponent } from './dmca-notice-takedown-policy/dmca-notice-takedown-policy.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'security-privacy-policy', component: SecurityPrivacyPolicyComponent },
  { path: 'dmca-notice-takedown-policy', component: DmcaNoticeTakedownPolicyComponent },
  { path: 'acceptable-use-policy', component: AcceptableUsePolicyComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    CreateAccountComponent,
    UserHomepageComponent,
    SecurityPrivacyPolicyComponent,
    AcceptableUsePolicyComponent,
    DmcaNoticeTakedownPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
