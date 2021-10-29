import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  //@Output() selectedContactEvent = new EventEmitter<Contact>();
  subscription: Subscription;

  contacts: Contact[] = [];

  constructor(private contactSerivce: ContactService) {
    this.contacts = this.contactSerivce.getContacts();
  }

  ngOnInit() {
    this.subscription = this.contactSerivce.contactListChangedEvent
      .subscribe((contactsArray: Contact[]) => {
        this.contacts = contactsArray;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
