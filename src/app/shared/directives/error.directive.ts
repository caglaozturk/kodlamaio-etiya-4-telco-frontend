import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[etiyaError]',
})
export class ErrorDirective {
  @Input() etiyaError!: 'error-text';

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {}

  ngOnInit() {
    this.renderer.addClass(
      this.hostElement.nativeElement,
      `e-${this.etiyaError}`
    );
  }
}
