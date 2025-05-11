import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTasksComponent } from './open-tasks.component';

describe('OpenTasksComponent', () => {
  let component: OpenTasksComponent;
  let fixture: ComponentFixture<OpenTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
