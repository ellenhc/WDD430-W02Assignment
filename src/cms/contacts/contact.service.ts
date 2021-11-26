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
    this.fetchContacts();
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    return this.contacts.slice();
  }

  fetchContacts() {
    this.http.get('http://localhost:3000/contacts')
      .subscribe(
        // success method
        (contacts: Contact[]) => {
          this.contacts = contacts['contacts'];
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
    return;
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
    //const pos = this.contacts.indexOf(contact);
    const pos = this.contacts.findIndex(d => d.id === contact.id);
    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/'+ contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.storeContacts();
      }
    );
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

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http.post<{ message: string, contact: Contact }>
      ('http://localhost:3000/contacts',
        contact,
        { headers: headers })
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          this.storeContacts();
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    //const pos = this.contacts.indexOf(originalContact);
    const pos = this.contacts.findIndex(d => d.id === originalContact.id);
    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.storeContacts();
        }
      );
  }

  storeContacts() {
    this.contactListChangedEvent.next(this.contacts.slice());

  //   const stringContacts = JSON.stringify(this.contacts);

  //   //create HttpHeaders object & set content-type to application/json
  //   const headers = new HttpHeaders().set('content-type', 'application/json');

  //   // call put() to send contact list to database
  //   this.http.put('http://localhost:3000/contacts/', stringContacts, { headers })
  //     .subscribe(data => {
  //       //emits contactListChnagedEvent & pass cloned copy of doc array
  //       this.contactListChangedEvent.next(this.contacts.slice());
  //     });
  }
}
