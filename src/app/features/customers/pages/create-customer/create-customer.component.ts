import { map, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SearchCustomer } from '../../models/searchCustomer';

@Component({
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  profileForm!: FormGroup;
  createCustomerModel$!: Observable<Customer>;
  customer!: Customer;
  isShow: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.createCustomerModel$ = this.customerService.customerToAddModel$;
  }

  ngOnInit(): void {
    this.createCustomerModel$.subscribe((state) => {
      this.customer = state;
      this.createFormAddCustomer();
    });
  }

  createFormAddCustomer() {
    this.profileForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [this.customer.birthDate, Validators.required],
      gender: [this.customer.gender ?? '', Validators.required],
      fatherName: [this.customer.fatherName],
      motherName: [this.customer.motherName],
      nationalityId: [
        this.customer.nationalityId,
        [Validators.pattern('^[0-9]{11}$'), Validators.required],
      ],
    });
  }
  next() {
    this.checkInvalid();
  }
  checkInvalid() {
    if (this.profileForm.invalid) {
      this.isShow = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter required fields',
        key: 'etiya-standard',
      });
      return;
    }
    this.checkTcNum(this.profileForm.value.nationalityId);
  }
  checkTcNum(nationalityId: number) {
    let searchCustomer: SearchCustomer = {
      nationalityId: nationalityId,
      customerId: Number(''),
      accountNumber: '',
      gsmNumber: '',
      firstName: '',
      lastName: '',
      orderNumber: Number(''),
    };
    this.customerService.getListByFilter(searchCustomer).subscribe((data) => {
      if (data.length !== 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'A customer is already exist with this Nationality ID',
          key: 'etiya-standard',
        });
        return;
      }
      this.goNextPage();
    });
  }
  goNextPage() {
    this.isShow = false;
    this.customerService.setDemographicInfoToStore(this.profileForm.value);
    this.router.navigateByUrl('/dashboard/customers/list-address-info');
  }
}
