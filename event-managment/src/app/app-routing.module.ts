import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { TermsConditionsComponent } from './docs/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './docs/privacy-policy/privacy-policy.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth-guard.guard';
import { homeGuard } from './guards/home.guard';
import { VolunteerListComponent } from './components/volunteer-list/volunteer-list.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { FormCanDeactivateGuard } from './guards/form-candeactivate.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VolunteerComponent } from './components/volunteer/volunteer.component';
import { AppliedEventsComponent } from './components/applied-events/applied-events.component';
import { EventsComponent } from './components/events/events.component';
import { EventIdComponent } from './components/event-id/event-id.component';
import { ApplicationListComponent } from './components/application-list/application-list.component';
import { ChatComponent } from './components/chat-screen/chat/chat.component';
import { ChatScreenComponent } from './components/chat-screen/chat-screen.component';
import { ChatStartComponent } from './components/chat-screen/chat-start/chat-start.component';
import { CallComponent } from './components/chat-screen/chat/call/call.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'chat',
    component: ChatScreenComponent,
    children: [
      { path: '', component: ChatStartComponent },
      { path: ':recipent-id', component: ChatComponent },
    ],
  },
  { path: 'home', component: HomeComponent, canActivate: [homeGuard] },
  { path: 'about', component: AboutComponent, canActivate: [homeGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [homeGuard] },
  { path: 'login', component: LoginComponent, canActivate: [homeGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [homeGuard] },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [homeGuard],
  },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'reset-password/:id/:token', component: ResetPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'volunteer-list',
    component: VolunteerListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'applied-events',
    component: AppliedEventsComponent,
    canActivate: [authGuard],
  },
  { path: 'events', component: EventsComponent, canActivate: [authGuard] },
  { path: 'events/:id', component: EventIdComponent, canActivate: [authGuard] },
  {
    path: 'application-list',
    component: ApplicationListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create-event',
    component: CreateEventComponent,
    canActivate: [authGuard],
    canDeactivate: [FormCanDeactivateGuard],
  },
  {
    path: 'event-list',
    component: EventListComponent,
    canActivate: [authGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'volunteer/:id',
    component: VolunteerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'call/:roomId',
    component: CallComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
