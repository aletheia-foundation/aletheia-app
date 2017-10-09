import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPaperComponent } from './submit-paper.component';

describe('SubmitPaperComponent', () => {
  let component: SubmitPaperComponent;
  let fixture: ComponentFixture<SubmitPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
