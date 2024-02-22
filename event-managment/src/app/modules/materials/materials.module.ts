import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';



const materials = [
  MatSlideToggleModule,
  MatTabsModule,
  MatStepperModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule
]

@NgModule({
  imports: [materials],
  exports: [materials]
})
export class MaterialsModule { }
