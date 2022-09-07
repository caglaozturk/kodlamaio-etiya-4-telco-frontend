import { Component, Input, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-standard-toast',
  templateUrl: './standard-toast.component.html',
  styleUrls: ['./standard-toast.component.css'],
})
export class StandardToastComponent implements OnInit {
  @Input() customSeverity!: string;
  @Input() customSummary!: string;
  @Input() customDetail!: string;
  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  showCustomMessage() {
    this.messageService.add({
      severity: this.customSeverity,
      summary: this.customSummary,
      detail: this.customDetail,
    });
  }
}
