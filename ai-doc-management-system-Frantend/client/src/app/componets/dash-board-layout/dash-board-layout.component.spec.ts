import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashBoardLayoutComponent } from './dash-board-layout.component';

describe('DashBoardLayoutComponent', () => {
  let component: DashBoardLayoutComponent;
  let fixture: ComponentFixture<DashBoardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashBoardLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashBoardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
