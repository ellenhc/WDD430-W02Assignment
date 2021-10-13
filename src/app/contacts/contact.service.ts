import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];

  contactSelectedEvent = new EventEmitter<Contact>();

  constructor() { 
    this.contacts = MOCKCONTACTS;
  }

  getContacts() : Contact[]{
    //return copy of contacts array
    return this.contacts.slice();
  }

  getContact(id: string): Contact{
    //find a specific Contact object in contacts[]
    for(let contact in this.contacts){
      if(this.contacts[id]== id){
        return this.contacts[contact];
      }
    }
    return null;
  }


}
