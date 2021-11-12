import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];

  documentListChangedEvent = new Subject<Document[]>();

  documentSelectedEvent = new EventEmitter<Document>();

  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.documents = this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    this.http.get('https://ehccms-76c34-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        // success method
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          //sort the list of documents
          this.documents.sort((a, b) => {
            if (a.id > b.id) { return 1 }
            else if (a.id < b.id) { return -1 }
            else { return 0 }
          })
          //emit the next document list change event
          this.documentListChangedEvent.next(this.documents.slice());
        }, // error method
        (error: any) => {
          console.log(error);
        });
    return this.documents;
  }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id == id) {
        return document;
      }
    }
    return null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    //this.documentListChangedEvent.next(this.documents.slice());
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      let currentId: number = parseInt(document.id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    //this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    //this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  storeDocuments() {
    // convert documents array to string format
    const stringDocs = JSON.stringify(this.documents);

    //create HttpHeaders object & set content-type to application/json
    const headers = new HttpHeaders().set('content-type', 'application/json');

    // call put() to send document list to database
    this.http.put('https://ehccms-76c34-default-rtdb.firebaseio.com/documents.json', stringDocs, { headers })
      .subscribe(data => {
        //emits documentListChnagedEvent & pass cloned copy of doc array
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
}
