import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentExplanationComponent } from './segment-explanation.component';

describe('SegmentExplanationComponent', () => {
  let component: SegmentExplanationComponent;
  let fixture: ComponentFixture<SegmentExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentExplanationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
