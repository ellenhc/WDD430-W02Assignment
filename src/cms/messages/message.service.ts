import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[];

  messageChangedEvent = new EventEmitter<Message[]>();

  maxMessageId : number;

  constructor(private http: HttpClient) {
    this.messages = this.getMessages();
    this.maxMessageId = this.getMaxId();
  }

  getMessages(): Message[] {
    this.http.get('https://ehccms-76c34-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        // success method
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();

          this.messages.sort((a, b) => {
            if (a.id > b.id) { return 1 }
            else if (a.id < b.id) { return -1 }
            else { return 0 }
          })
          this.messageChangedEvent.next(this.messages.slice());
        }, // error method
        (error: any) => {
          console.log(error);
        });
    return this.messages;
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id == id) {
        return message;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    if (this.messages == undefined) return 0;
    for (let message of this.messages) {
      let currentId: number = parseInt(message.id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    //this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  storeMessages(){
    const stringMessages = JSON.stringify(this.messages);
    
    const headers = new HttpHeaders().set('content-type', 'application/json');

    this.http.put('https://ehccms-76c34-default-rtdb.firebaseio.com/messages.json', stringMessages, { headers })
      .subscribe(data => {
        //emits documentListChnagedEvent & pass cloned copy of doc array
        this.messageChangedEvent.next(this.messages.slice());
      });
  }
}
