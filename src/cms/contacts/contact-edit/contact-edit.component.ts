import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        if (!params.id) {
          this.editMode = false;
          return;
        } //endif
        this.originalContact = this.contactService.getContact(id);

        if (!this.originalContact) {
          return;
        } //endif
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        //if the contact has a group (not null)
        if (this.contact.group) {
          this.groupContacts = this.contact.group;
        } //endif
      })
  }

  onCancel() {
    this.router.navigateByUrl('/contacts');
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    }
    else {
      this.contactService.addContact(newContact);
    }
    // route back to '/documents' URL
    this.router.navigateByUrl('/contacts');
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}
