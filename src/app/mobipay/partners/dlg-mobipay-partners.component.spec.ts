import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DlgMobipayPartnersComponent } from './dlg-mobipay-partners.component';

describe('PartnersComponent', () => {
  let component: DlgMobipayPartnersComponent;
  let fixture: ComponentFixture<DlgMobipayPartnersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [DlgMobipayPartnersComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgMobipayPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
