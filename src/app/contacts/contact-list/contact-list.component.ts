import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  //@Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [];

  constructor(private contactSerivce: ContactService) {}

  ngOnInit() {
    this.contacts = this.contactSerivce.getContacts();
  }

  onSelected(contact: Contact){
    //this.selectedContactEvent.emit(contact);
    this.contactSerivce.contactSelectedEvent.emit(contact);
  }

}
