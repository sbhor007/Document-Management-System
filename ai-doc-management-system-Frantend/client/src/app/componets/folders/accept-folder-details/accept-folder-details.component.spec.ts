import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptFolderDetailsComponent } from './accept-folder-details.component';

describe('AcceptFolderDetailsComponent', () => {
  let component: AcceptFolderDetailsComponent;
  let fixture: ComponentFixture<AcceptFolderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptFolderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptFolderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
