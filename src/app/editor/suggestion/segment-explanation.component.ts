import { Component, Input, OnInit } from '@angular/core';
import segmentExplanation, { SegmentExplanation } from 'lanna-utils/dist/segment-explanation';
import { ThaiExplanation } from './thai-explanation';

@Component({
  selector: 'pimlanna-segment-explanation',
  templateUrl: './segment-explanation.component.html',
  styleUrls: ['./segment-explanation.component.css']
})
export class SegmentExplanationComponent implements OnInit {

  @Input() explanation!: SegmentExplanation;
  public thaiExplanation: ThaiExplanation;

  constructor() {
    this.thaiExplanation = new ThaiExplanation(segmentExplanation());
  }

  ngOnInit(): void {
    this.thaiExplanation = new ThaiExplanation(this.explanation ?? segmentExplanation());
  }

}
