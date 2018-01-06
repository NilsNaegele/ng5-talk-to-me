import { Injectable, NgZone } from '@angular/core';

import { environment } from '../../environments/environment';

import { Message } from '../models/message';
import { IWindow } from '../interfaces/iwindow';

import { ApiAiClient } from 'api-ai-javascript';
import * as lodash from 'lodash';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AIService {

  readonly token = environment.dialogFlow.angularAIBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  speechRecognition: any;
  conversation = new BehaviorSubject<Message[]>([]);

  constructor(private zone: NgZone) { }

  textConversation(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);
    return this.client.textRequest(msg).then(response => {
      const speech = response.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.update(botMessage);
    });
  }

  update(msg: Message) {
    this.conversation.next([msg]);
  }

  voiceConversation(): Observable<string> {
    return Observable.create(observer => {
          const { webkitSpeechRecognition }: IWindow = <IWindow>window;
          this.speechRecognition = new webkitSpeechRecognition();
          this.speechRecognition.continuous = false;
          this.speechRecognition.interimResults = false;
          this.speechRecognition.lang = 'en-us';
          this.speechRecognition.maxAlternatives = 0;

          this.speechRecognition.onresult = speech => {
            let sentence = '';
            if (speech.results) {
              const result = speech.results[speech.resultIndex];
              const transcript = result[0].transcript;
              if (result.isFinal) {
                if (result[0].confidence < 0.1) {
                  console.log('unrecognized result - please try again');
                } else {
                  sentence = lodash.trim(transcript);
                  console.log('did you say? -> ' + sentence + ', if not say something else ...');
                }
              }
            }
            this.zone.run(() => {
                observer.next(sentence);
            });
          };

          this.speechRecognition.onerror = error => {
            observer.error(error);
          };

          this.speechRecognition.onend = () => {
            observer.complete();
          };

          this.speechRecognition.start();
          console.log('i\m listening');
    });
  }

  destroyVoiceConversation() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }

}
