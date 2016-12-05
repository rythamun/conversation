import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Conversation, ConversationStep, ConversationDecision} from './conversation';
import {BackgroundStyle} from './background-style';

@Component({
  selector: 'ryth-conversation',
  template: `
<div *ngIf="conversationStep.decisions">
  <ryth-action-selection
    [decisions]="conversationStep.decisions" 
    (decisionSelected)="onDecisionSelected($event)"
    *ngIf="conversationStep.decisions.length > 0">
  </ryth-action-selection>
</div>
  
<div [ngStyle]="backgroundStyle" (click)="onClick()">

  <img class="event-character" [src]="conversationStep.characterImgUrl">
   
  <ryth-textbox
    [speaker]="conversationStep.speaker"
    [profile_img]="conversationStep.speakerProfilImgUrl">
        {{conversationStep.text}}
  </ryth-textbox>

</div>`,
  styles: [`

@media (min-width: 992px) {
  img.event-character {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 80vh;
    max-height: 80vh;
    width: auto;
    max-width: 90vw;
  }
}

@media screen and (orientation: portrait) {
  img.event-character {
    display: block;
    position: absolute;
    right: 0;
    bottom: 18vh;
    margin: 10px 10px 10px 10px;
    height: auto;
    max-height: 72vh;
    width: auto;
    max-width: 100vw;
  }
}

@media screen and (orientation: landscape) {
  img.event-character {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 80vh;
    max-height: 80vh;
    width: auto;
    max-width: 90vw;
  }
}
`]
})
export class ConversationComponent implements OnInit {

  @Input() conversation: Conversation = null;
  @Output() conversationEnded = new EventEmitter();

  backgroundStyle: any = null;
  conversationStep: ConversationStep = null;

  ngOnInit() {

    if (this.conversation) {
      this.conversationStep = this.conversation.conversationSteps[0];
      this.backgroundStyle = new BackgroundStyle(this.conversationStep.backgroundImgUrl).getStyle();
    }

  }

  onClick() {
    if (!this.conversationStep.decisions) {

      if (this.conversationStep.nextStep) {
        this.getNextStep(this.conversationStep.nextStep);
      }
      else {
        this.isEventFinished();
      }

    }
  }

  getNextStep(id: string) {
    this.conversationStep = this.conversation.conversationSteps.filter(item => item.id === id)[0];
  }

  onDecisionSelected(decision: ConversationDecision) {
    if (decision.nextStep) {
      this.getNextStep(decision.nextStep);
    }
    else {
      this.isEventFinished();
    }
  }

  private isEventFinished() {
    if (!this.conversationStep.nextStep && !this.conversationStep.decisions) {
      this.conversationEnded.emit();
    }
  }

}