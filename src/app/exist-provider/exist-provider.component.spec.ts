import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistProviderComponent } from './exist-provider.component';

describe('SupplierDetailsComponent', () => {
  let component: ExistProviderComponent;
  let fixture: ComponentFixture<ExistProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
