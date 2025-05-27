import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeExpensesComponent } from './merge-expenses.component';

describe('MergeExpensesComponent', () => {
  let component: MergeExpensesComponent;
  let fixture: ComponentFixture<MergeExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeExpensesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MergeExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
