import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgEnterTemplateName } from './dlg-enter-template-name.component';

describe('EnterTemplateNameComponent', () => {
  let component: DlgEnterTemplateName;
  let fixture: ComponentFixture<DlgEnterTemplateName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DlgEnterTemplateName]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgEnterTemplateName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
