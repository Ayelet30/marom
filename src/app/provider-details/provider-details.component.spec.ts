import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDetailsComponent  } from './provider-details.component';

describe('NewProviderComponent', () => {
  let component: ProviderDetailsComponent ;
  let fixture: ComponentFixture<ProviderDetailsComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderDetailsComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
