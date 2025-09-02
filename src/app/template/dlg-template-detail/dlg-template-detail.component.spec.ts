import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgTemplateDetailComponent } from './dlg-template-detail.component';

describe('DlgTemplateDetailComponent', () => {
  let component: DlgTemplateDetailComponent;
  let fixture: ComponentFixture<DlgTemplateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DlgTemplateDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
