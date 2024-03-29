import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { HomeComponent } from './home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloaderComponent } from './shared/preloader/preloader.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialsModule } from './modules/materials/materials.module';
import { AchievementBoxTwoComponent } from './shared/achievement-box-two/achievement-box-two.component';
import { TestimonialSliderComponent } from './shared/testimonial-slider/testimonial-slider.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PrivacyPolicyComponent } from './docs/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './docs/terms-conditions/terms-conditions.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VolunteerListComponent } from './components/volunteer-list/volunteer-list.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { MyHttpInterceptor } from './interceptors/my-http.interceptor';
import { ErrorComponent } from './shared/error/error.component';
import { VolunteerComponent } from './components/volunteer/volunteer.component';

import { NgxStripeModule, StripeCardComponent } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { StripeCheckoutComponent } from './components/stripe-checkout/stripe-checkout.component';
import { PaymentCardComponent } from './shared/payment-card/payment-card.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { InnerFooterComponent } from './shared/inner-footer/inner-footer.component';
import { EventsComponent } from './components/events/events.component';
import { AppliedEventsComponent } from './components/applied-events/applied-events.component';
import { EventIdComponent } from './components/event-id/event-id.component';
import { ApplicationListComponent } from './components/application-list/application-list.component';
import { ChatComponent } from './components/chat-screen/chat/chat.component';
import { ChatScreenComponent } from './components/chat-screen/chat-screen.component';
import { ChatStartComponent } from './components/chat-screen/chat-start/chat-start.component';
import { CallComponent } from './components/chat-screen/chat/call/call.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { IgxCalendarModule } from 'igniteui-angular';
import { AddTaskComponent } from './components/dashboard/add-task/add-task.component';
import { CompletedEventsComponent } from './components/completed-events/completed-events.component';

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PreloaderComponent,
    AchievementBoxTwoComponent,
    TestimonialSliderComponent,
    FooterComponent,
    AboutComponent,
    LoginComponent,
    SignupComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    ContactComponent,
    NotFoundComponent,
    DashboardComponent,
    VolunteerListComponent,
    CreateEventComponent,
    ProfileComponent,
    EventListComponent,
    ErrorComponent,
    StripeCheckoutComponent,
    PaymentCardComponent,
    EventDetailsComponent,
    TruncatePipe,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    InnerFooterComponent,
    EventsComponent,
    AppliedEventsComponent,
    EventIdComponent,
    ApplicationListComponent,
    VolunteerComponent,
    ChatComponent,
    ChatScreenComponent,
    ChatStartComponent,
    CallComponent,
    AddTaskComponent,
    CompletedEventsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    StripeCardComponent,
    PickerComponent,
    HammerModule,
    IgxCalendarModule,
    NgxStripeModule.forRoot(environment.stripe.publicKey),
    SocketIoModule.forRoot(config),
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true,
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
