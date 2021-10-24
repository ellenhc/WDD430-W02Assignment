import { Component, OnInit } from '@angular/core';
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

  constructor(private contactSerivce: ContactService) {
    this.contacts = this.contactSerivce.getContacts();
  }

  ngOnInit() {
    //this.contacts = this.contactSerivce.getContacts();
    
    this.contactSerivce.contactChangedEvent
      .subscribe((contactsArray: Contact[]) => {
        this.contacts = contactsArray;
      });
  }

 /* onSelected(contact: Contact){
    //this.selectedContactEvent.emit(contact);
    this.contactSerivce.contactSelectedEvent.emit(contact);
  }*/

}
