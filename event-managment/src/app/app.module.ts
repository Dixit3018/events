import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { HomeComponent } from './home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloaderComponent } from './layouts/preloader/preloader.component';
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
import { ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VolunteerListComponent } from './components/volunteer-list/volunteer-list.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { MyHttpInterceptor } from './interceptors/my-http.interceptor';
import { ErrorComponent } from './shared/error/error.component';

import { NgxStripeModule, StripeCardComponent } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { StripeCheckoutComponent } from './components/stripe-checkout/stripe-checkout.component';
import { PaymentCardComponent } from './shared/payment-card/payment-card.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';


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
    EditEventComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialsModule,
    StripeCardComponent,
    NgxStripeModule.forRoot(environment.stripe.publicKey)
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
      useValue: {showError: true},
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
