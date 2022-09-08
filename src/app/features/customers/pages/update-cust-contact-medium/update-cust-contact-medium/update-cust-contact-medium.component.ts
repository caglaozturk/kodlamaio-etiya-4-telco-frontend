import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Customer } from '../../../models/customer';
import { CustomersService } from '../../../services/customer/customers.service';

@Component({
  templateUrl: './update-cust-contact-medium.component.html',
  styleUrls: ['./update-cust-contact-medium.component.css'],
})
export class UpdateCustContactMediumComponent implements OnInit {
  updateCustomerContactForm!: FormGroup;
  selectedCustomerId!: number;
  customer!: Customer;
  isShow: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private customersService: CustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
  }

  createFormUpdateContactCustomer() {
    this.updateCustomerContactForm = this.formBuilder.group({
      email: [
        this.customer.contactMedium?.email,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      homePhone: [
        this.customer.contactMedium?.homePhone,
        [Validators.maxLength(11)],
      ],
      mobilePhone: [
        this.customer.contactMedium?.mobilePhone,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      fax: [this.customer.contactMedium?.fax, [Validators.maxLength(13)]],
    });
  }
  get f() {
    return this.updateCustomerContactForm.controls;
  }
  getCustomerById() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = params['id'];
      console.log(this.selectedCustomerId);
    });
    if (this.selectedCustomerId == undefined) {
      this.messageService.add({
        detail: 'Customer not found!...',
        severity: 'danger',
        summary: 'error',
        key: 'etiya-custom',
      });
    } else {
      this.customersService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.customer = data;
          this.createFormUpdateContactCustomer();
        });
    }
  }
  update() {
    if (this.updateCustomerContactForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The information you entered is incorrect. Please try again',
        key: 'etiya-standard',
      });
      this.isShow = true;
      return;
    }
    this.isShow = false;
    this.customersService
      .updateContactMedium(this.updateCustomerContactForm.value, this.customer)
      .subscribe(() => {
        this.router.navigateByUrl(
          `/dashboard/customers/customer-contact-medium/${this.customer.id}`
        );
        this.messageService.add({
          detail: 'Sucsessfully updated',
          severity: 'success',
          summary: 'Update',
          key: 'etiya-custom',
        });
      });
  }
}
