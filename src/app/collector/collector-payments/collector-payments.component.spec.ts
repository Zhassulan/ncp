import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorPaymentsComponent } from './collector-payments.component';

describe('CollectorPaymentsComponent', () => {
  let component: CollectorPaymentsComponent;
  let fixture: ComponentFixture<CollectorPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
