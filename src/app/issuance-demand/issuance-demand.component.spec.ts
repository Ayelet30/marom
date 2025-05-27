import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceDemandComponent } from './issuance-demand.component';

describe('IssuanceDemandComponent', () => {
  let component: IssuanceDemandComponent;
  let fixture: ComponentFixture<IssuanceDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuanceDemandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssuanceDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
