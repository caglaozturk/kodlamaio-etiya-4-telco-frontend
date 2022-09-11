import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Address } from '../../models/address';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  selector: 'app-list-address-info',
  templateUrl: './list-address-info.component.html',
  styleUrls: ['./list-address-info.component.css'],
})
export class ListAddressInfoComponent implements OnInit {
  customer!: Customer;
  addressToDelete!: Address;
  constructor(
    private customersService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.customersService.customerToAddModel$.subscribe((state) => {
      this.customer = state;
    });
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'reject') {
        this.messageService.clear();
      } else if (data == 'confirm') {
        this.messageService.clear();
        this.remove();
      }
    });
  }
  selectAddressId(id: number) {
    let address = this.customer.addresses?.find((c) => c.id == id);
    this.router.navigateByUrl(`update-address-info/${address?.id}`);
  }
  removePopup(address: Address) {
    this.addressToDelete = address;
    if (this.customer.addresses && this.customer.addresses.length <= 1) {
      this.messageService.add({
        key: 'okey',
        sticky: true,
        severity: 'warn',
        detail: 'Customer should have at least one address',
      });
    } else if (this.addressToDelete.isMain) {
      this.messageService.add({
        key: 'okey',
        sticky: true,
        severity: 'warn',
        detail:
          'The address that you want to delete is a default address. Please, change default address then try again',
      });
    } else {
      this.messageService.add({
        key: 'c',
        sticky: true,
        severity: 'warn',
        detail: 'Are you sure to delete this address?',
      });
    }
  }
  remove() {
    this.customersService.removeAdressToStore(this.addressToDelete);
  }
  handleConfigInput(event: any) {
    this.customer.addresses = this.customer.addresses?.map((adr) => {
      const newAddress = { ...adr, isMain: false };
      return newAddress;
    });
    let findAddress = this.customer.addresses?.find((adr) => {
      return adr.id == event.target.value;
    }) as Address;
    findAddress!.isMain = true;

    this.customersService.updateAddressInfoToStore(findAddress);
  }
}
