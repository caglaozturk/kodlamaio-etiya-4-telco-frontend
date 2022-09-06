import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomersService } from 'src/app/features/customers/services/customer/customers.service';

@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.css'],
})
export class SideFilterComponent implements OnInit {
  @Input() filterTitle!: string;
  searchForm!: FormGroup;
  @Output() filteredData: any = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.createSearchForm();
  }

  createSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      nationalityId: ['', [Validators.min(1), Validators.maxLength(11)]],
      customerId: ['', [Validators.min(1), Validators.maxLength(10)]],
      accountNumber: ['', [Validators.min(1), Validators.maxLength(10)]],
      gsmNumber: ['', [Validators.min(1), Validators.maxLength(10)]],
      firstName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      orderNumber: ['', [Validators.min(1), Validators.maxLength(16)]],
    });
  }

  search() {
    if (this.searchForm.invalid) {
      this.messageService.add({
        detail: 'Please Check The Fields!',
        severity: 'danger',
        summary: 'Error',
        key: 'etiya-custom',
      });
      return;
    }
    this.customersService
      .getListByFilter(this.searchForm.value)
      .subscribe((data) => {
        this.filteredData.emit(data);
      });
  }
  clear() {
    this.createSearchForm();
  }
}
