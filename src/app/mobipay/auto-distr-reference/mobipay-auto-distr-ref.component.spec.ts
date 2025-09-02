import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobipayAutoDistrRefComponent } from './mobipay-auto-distr-ref.component';

describe('AutoDistrReferenceComponent', () => {
  let component: MobipayAutoDistrRefComponent;
  let fixture: ComponentFixture<MobipayAutoDistrRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MobipayAutoDistrRefComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobipayAutoDistrRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
