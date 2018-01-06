import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { AIService } from './../../services/ai.service';
import { Message } from '../../models/message';

import { Observable } from 'rxjs/Observable';
import { scan } from 'rxjs/operators';


@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss']
})
export class AIComponent implements OnInit, OnDestroy {
  allMessages: Observable<Message[]>;
  formInput: string;

  constructor(private aiService: AIService,
              private snackBar: MatSnackBar) {
    this.openSnackBar();
    this.formInput = '';
   }

   openSnackBar() {
     this.snackBar.open('Welcome', 'Friends', {
          duration: 3000
     });
   }

  ngOnInit() {
    this.allMessages = this.aiService.conversation.asObservable()
                       .pipe(scan((acc, val) => acc.concat(val))
                       );
  }

  ngOnDestroy() {
    this.aiService.destroyVoiceConversation();
  }

  sendMessageToBot() {
    this.formInput = this.formInput.trim();
    if (!this.formInput) {
      return;
    }
    this.aiService.textConversation(this.formInput);
    this.formInput = '';
  }

  startTalkingToBot() {
    this.aiService.voiceConversation().subscribe((value) => {
        this.formInput = value;
        console.log(value);
    },
    (error) => {
      console.log(error);
      if (error.error === 'no-speech') {
        this.startTalkingToBot();
      }
    },
    () => {
      console.log('talking complete');
      this.startTalkingToBot();
    }
  );
  }

  navigate() {
    window.open('https://github.com/NilsNaegele/ng5-talk-to-me.git', '_blank');
  }

}
