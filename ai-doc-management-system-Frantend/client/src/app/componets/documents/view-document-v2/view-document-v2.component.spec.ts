import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentV2Component } from './view-document-v2.component';

describe('ViewDocumentV2Component', () => {
  let component: ViewDocumentV2Component;
  let fixture: ComponentFixture<ViewDocumentV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocumentV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDocumentV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
