import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  messageChangedEvent = new EventEmitter<Message[]>();

  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.fetchMessages();
    this.maxMessageId = this.getMaxId();
  }

  getMessages() {
    return this.messages.slice();
  }

  fetchMessages() {
    this.http.get('http://localhost:3000/messages')
      .subscribe(
        // success method
        (messages: Message[]) => {
          this.messages = messages['messages'];
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
    return;
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

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }

    // make sure id of the new Message is empty
    newMessage.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{message: string, newMessage: Message}>
    ('http://localhost:3000/messages',
    newMessage,
    {headers: headers})
    .subscribe(
      (responseData) => {
        this.messages.push(responseData.newMessage);
        this.storeMessages();
      }
    );
  }

  
updateMessage(originalMessage: Message, newMessage: Message) {
  if (!originalMessage || !newMessage) {
    return;
  }

  const pos = this.messages.findIndex(d => d.id === originalMessage.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newMessage.id = originalMessage.id;
  //newMessage._id = originalMessage._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/messages/' + originalMessage.id,
  newMessage, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.messages[pos] = newMessage;
        this.storeMessages();
      }
    );
}

deleteMessage(message: Message) {

  if (!message) {
    return;
  }

  const pos = this.messages.findIndex(d => d.id === message.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/messages/' + message.id)
    .subscribe(
      (response: Response) => {
        this.messages.splice(pos, 1);
        this.storeMessages();
      }
    );
}

  storeMessages() {
    this.messageChangedEvent.next(this.messages.slice());
    // const stringMessages = JSON.stringify(this.messages);

    // const headers = new HttpHeaders().set('content-type', 'application/json');

    // this.http.put('https://ehccms-76c34-default-rtdb.firebaseio.com/messages.json', stringMessages, { headers })
    //   .subscribe(data => {
    //     //emits documentListChnagedEvent & pass cloned copy of doc array
    //     this.messageChangedEvent.next(this.messages.slice());
    //   });
  }
}
