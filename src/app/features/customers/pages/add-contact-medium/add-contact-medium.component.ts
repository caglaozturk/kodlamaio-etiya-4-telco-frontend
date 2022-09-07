import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  selector: 'app-add-contact-medium',
  templateUrl: './add-contact-medium.component.html',
  styleUrls: ['./add-contact-medium.component.css'],
})
export class AddContactMediumComponent implements OnInit {
  contactForm!: FormGroup;
  customer!: Customer;
  isShow: Boolean = false;
  constructor(
    private customersService: CustomersService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.customersService.customerToAddModel$.subscribe((state) => {
      this.customer = state;
      this.createFormContactMedium();
    });
  }
  createFormContactMedium() {
    this.contactForm = this.formBuilder.group({
      email: [
        this.customer.contactMedium?.email,
        [
          Validators.required,
          Validators.maxLength(350),
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
        [Validators.required, Validators.maxLength(10)],
      ],
      fax: [this.customer.contactMedium?.fax, [Validators.maxLength(13)]],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  goToPreviousPage() {
    this.saveContactMediumToStore();
    this.router.navigateByUrl('/dashboard/customers/list-address-info');
  }

  saveContactMediumToStore() {
    this.customersService.setContactMediumInfoToStore(this.contactForm.value);
  }

  saveCustomer() {
    if (this.contactForm.invalid) {
      this.isShow = true;
      return;
    }
    this.isShow = false;
    this.saveContactMediumToStore();
    this.customersService.add(this.customer).subscribe({
      next: (data) => {
        this.messageService.add({
          detail: 'Sucsessfully added',
          severity: 'success',
          summary: 'Add',
          key: 'etiya-custom',
        });
        console.log(data.id);
        //this.router.navigateByUrl('/dashboard/customers/customer-dashboard');

        // Todo: route değişecek
        //this.router.navigateByUrl(`/dashboard/customers/customer-info/${data.id}`);
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
  }
}
