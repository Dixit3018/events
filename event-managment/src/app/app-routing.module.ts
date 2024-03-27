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
import { CompletedEventsComponent } from './components/completed-events/completed-events.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: '', // Empty path for the parent route
    canActivate: [homeGuard], // Apply guard to all child routes
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'reset-password/:id/:token', component: ResetPasswordComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'volunteer-list', component: VolunteerListComponent },
      { path: 'completed-events', component: CompletedEventsComponent },
      { path: 'applied-events', component: AppliedEventsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'events/:id', component: EventIdComponent },
      { path: 'application-list', component: ApplicationListComponent },
      {
        path: 'create-event',
        component: CreateEventComponent,
        canDeactivate: [FormCanDeactivateGuard],
      },
      { path: 'event-list', component: EventListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'volunteer/:id', component: VolunteerComponent },
      { path: 'call/:roomId', component: CallComponent },
      {
        path: 'chat',
        component: ChatScreenComponent,
        children: [
          { path: '', component: ChatStartComponent },
          { path: ':recipent-id', component: ChatComponent },
        ],
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
