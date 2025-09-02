import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDetailsTableComponent } from './template-details-table.component';

describe('DetailsTableComponent', () => {
  let component: TemplateDetailsTableComponent;
  let fixture: ComponentFixture<TemplateDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplateDetailsTableComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
