import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from 'src/app/features/city/services/city/city.service';
import { City } from '../../../models/city';
import { CustomersService } from '../../../services/customer/customers.service';
import { Address } from '../../../models/address';
import { Customer } from '../../../models/customer';
import { BillingAccount } from '../../../models/billingAccount';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './customer-billing-account.component.html',
  styleUrls: ['./customer-billing-account.component.css'],
})
export class CustomerBillingAccountComponent implements OnInit {
  accountForm!: FormGroup;
  addressForm!: FormGroup;
  isShown: boolean = false;
  isValid: boolean = false;
  isEmpty: boolean = false;
  cityList!: City[];
  selectedCustomerId!: number;
  customer!: Customer;
  billingAccount!: BillingAccount;
  billingAdress: Address[] = [];
  addresses!: Address;
  mainAddres!: number;

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private customerService: CustomersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getCityList();
    this.getMainAddress();
    this.createAddressForm();
    this.createAccountForm();
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = Number(params['id']);
      this.getCustomerById();
    });
  }

  getCustomerById() {
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.customer = data;
        });
    }
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      accountName: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      id: [Math.floor(Math.random() * 1000)],
      city: ['', Validators.required],
      street: ['', [Validators.required, Validators.maxLength(50)]],
      flatNumber: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  addNewAddressBtn() {
    this.isShown = true;
    this.createAddressForm();
  }

  getCityList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
    });
  }

  isPrimaryAdd() {
    return this.addresses == undefined ? true : false;
  }

  addAddress() {
    if (this.addressForm.valid) {
      this.isValid = false;
      const addressToAdd: Address = {
        ...this.addressForm.value,
        city: this.cityList.find(
          (city) => city.id == this.addressForm.value.city.id
        ),
        isPrimary: this.isPrimaryAdd(),
      };
      this.billingAdress.push(addressToAdd);
      console.log(this.billingAdress);
      this.isShown = false;
    } else {
      this.isValid = true;
      this.isEmpty = false;
    }
  }

  add() {
    if (this.accountForm.valid) {
      if (this.billingAdress.length == 0 && !this.addresses) {
        this.messageService.add({
          detail: 'Must have at least one address',
          severity: 'danger',
          summary: 'Error',
          key: 'etiya-custom',
        });
        return;
      }
      this.isEmpty = false;
      //this.billingAccount = this.accountForm.value;
      //this.billingAccount.addresses = this.billingAdress;
      let newBillingAccount: BillingAccount = {
        ...this.accountForm.value,
        addresses: [...this.billingAdress, this.addresses],
      };
      this.customerService
        .addBillingAccount(newBillingAccount, this.customer)
        .subscribe({
          next: () => {
            this.messageService.add({
              detail: 'Sucsessfully added',
              severity: 'success',
              summary: 'Add',
              key: 'etiya-custom',
            });
            this.router.navigateByUrl(
              `/dashboard/customers/customer-billing-account-detail/${this.selectedCustomerId}`
            );
          },
          error: (err) => {
            this.messageService.add({
              detail: 'Error created',
              severity: 'danger',
              summary: 'Error',
              key: 'etiya-custom',
            });
          },
        });
    } else {
      this.isEmpty = true;
      this.isValid = false;
    }
  }
  getMainAddress() {
    this.customerService
      .getCustomerById(this.selectedCustomerId)
      .subscribe((data) => {
        data.addresses?.forEach((adr) => {
          if (adr.isPrimary == true) this.addresses = adr;
        });
      });
  }
  handleConfigInput(event: any) {
    this.mainAddres = event.target.value;
    //this.add(event.target.value)
    this.billingAccount.addresses = this.billingAccount.addresses?.map(
      (adr) => {
        const newAddress = { ...adr, isPrimary: false };
        return newAddress;
      }
    );

    let findAddressBill = this.billingAccount.addresses.find((adr) => {
      return adr.id == event.target.value;
    });

    findAddressBill!.isPrimary = true;
    this.customerService.update(this.customer).subscribe((data) => {
      console.log(data);
      this.getCustomerById();
    });
  }
}
