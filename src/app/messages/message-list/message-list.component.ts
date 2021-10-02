import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message("1", "Nap time", "I'm showing signs that I'm tired.", "Rowan"),
    new Message("2", "Lunch is ready", "Time to pray so we can eat.", "Lily"),
    new Message("3", "I'm doing homework", "Shhh stop talking to me.", "Matthew")
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message){
    this.messages.push(message);
  }

}
