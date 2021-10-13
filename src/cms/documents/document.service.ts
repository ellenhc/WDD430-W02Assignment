import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[];

  documentSelectedEvent = new EventEmitter<Document>();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments() : Document[]{
    return this.documents.slice();
  }

  getDocument(id: string): Document{
    for(let document in this.documents){
      if(this.documents[id]== id){
        return this.documents[document];
      }
    }
    return null;
  }
}
