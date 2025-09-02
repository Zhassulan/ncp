import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryMenuComponent } from './registry-menu.component';

describe('RegistryMenuComponent', () => {
  let component: RegistryMenuComponent;
  let fixture: ComponentFixture<RegistryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RegistryMenuComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
