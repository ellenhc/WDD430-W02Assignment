import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];

  contactSelectedEvent = new EventEmitter<Contact>();
  
  contactListChangedEvent = new Subject<Contact[]>();

  maxContactId: number;

  constructor(private http: HttpClient) {
    this.contacts = this.getContacts();
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    this.http.get('https://ehccms-76c34-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        // success method
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();

          this.contacts.sort((a, b) => {
            if (a.name > b.name) { return 1 }
            else if (a.name < b.name) { return -1 }
            else { return 0 }
          })
          this.contactListChangedEvent.next(this.contacts.slice());
        }, // error method
        (error: any) => {
          console.log(error);
        });
    return this.contacts;
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    // this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      let currentId: number = parseInt(contact.id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    //this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    //this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  storeContacts() {
    const stringContacts = JSON.stringify(this.contacts);

    //create HttpHeaders object & set content-type to application/json
    const headers = new HttpHeaders().set('content-type', 'application/json');

    // call put() to send document list to database
    this.http.put('https://ehccms-76c34-default-rtdb.firebaseio.com/contacts.json', stringContacts, { headers })
      .subscribe(data => {
        //emits documentListChnagedEvent & pass cloned copy of doc array
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }
}
