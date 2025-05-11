import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProviderComponent } from './provider-details.component';

describe('NewProviderComponent', () => {
  let component: NewProviderComponent;
  let fixture: ComponentFixture<NewProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
