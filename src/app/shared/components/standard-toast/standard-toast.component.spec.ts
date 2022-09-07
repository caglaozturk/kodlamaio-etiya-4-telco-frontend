import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardToastComponent } from './standard-toast.component';

describe('StandardToastComponent', () => {
  let component: StandardToastComponent;
  let fixture: ComponentFixture<StandardToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardToastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
