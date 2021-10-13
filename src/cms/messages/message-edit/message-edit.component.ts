import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();
  
  currentSender: string = 'Ellen';

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage(){
    this.addMessageEvent.emit({
      id:'4',
      subject: this.subject.nativeElement.value,
      msgText: this.msgText.nativeElement.value,
      sender:this.currentSender
    })
  }

  onClear(){
    this.subject.nativeElement.value = "";
    this.msgText.nativeElement.value = "";
  }

}
