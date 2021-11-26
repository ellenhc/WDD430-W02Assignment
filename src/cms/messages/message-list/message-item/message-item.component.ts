import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/cms/contacts/contact.model';
import { ContactService } from 'src/cms/contacts/contact.service';
import { Message } from '../../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;

  messageSender: string;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    const contact: Contact = this.contactService.getContact(this.message.sender);
    if (contact == null || contact.name == undefined) this.messageSender = "N/A";
    else this.messageSender = contact.name;
  }

}
