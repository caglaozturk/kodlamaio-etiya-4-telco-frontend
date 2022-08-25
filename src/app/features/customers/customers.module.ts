import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { StoreModule } from '@ngrx/store';
import { customersReducers } from './store/customer.reducer';
import { CustomerDashboardComponent } from './pages/customer-dashboard/customer-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { AddContactMediumComponent } from './pages/add-contact-medium/add-contact-medium.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateCustomerComponent } from './pages/create-customer/create-customer.component';
import { AddAddressInfoComponent } from './pages/add-address-info/add-address-info.component';
import { ListAddressInfoComponent } from './pages/list-address-info/list-address-info.component';
import { CustomerAddressComponent } from './pages/customer-address/customer-address.component';
import { UpdateCustomerComponent } from './pages/update-customer/update-customer.component';





@NgModule({
  declarations: [
    CustomerDashboardComponent,
    AddContactMediumComponent,
    CreateCustomerComponent,
    AddAddressInfoComponent,
    ListAddressInfoComponent,
    CustomerAddressComponent,
    UpdateCustomerComponent


  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    StoreModule.forRoot(customersReducers),
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CustomersModule { }
