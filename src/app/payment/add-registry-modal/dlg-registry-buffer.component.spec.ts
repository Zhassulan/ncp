import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DlgRegistryBufferComponent } from './dlg-registry-buffer.component';

describe('AddRegistryModalComponent', () => {
  let component: DlgRegistryBufferComponent;
  let fixture: ComponentFixture<DlgRegistryBufferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [DlgRegistryBufferComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgRegistryBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
