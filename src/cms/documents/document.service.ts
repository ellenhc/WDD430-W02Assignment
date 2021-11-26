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
    this.fetchDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    return this.documents.slice();
  }

  fetchDocuments() {
    const self = this;
    this.http.get('http://localhost:3000/documents')
      .subscribe(
        // success method
        (documents: Document[]) => {
          self.documents = documents['documents'];
          self.maxDocumentId = self.getMaxId();
          //sort the list of documents
          self.documents.sort((a, b) => {
            if (a.id > b.id) { return 1 }
            else if (a.id < b.id) { return -1 }
            else { return 0 }
          })
          //emit the next document list change event
          self.documentListChangedEvent.next(self.documents.slice());
        }, // error method
        (error: any) => {
          console.log(error);
        });
    return;
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

    //const pos = this.documents.indexOf(document);
    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.storeDocuments();
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;
    console.log(this.documents);
    if (!this.documents) return 0;
    for (let document of this.documents) {
      let currentId: number = parseInt(document.id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http.post<{ message: string, document: Document }>
      ('http://localhost:3000/documents',
        document,
        { headers: headers })
      .subscribe(
        (responseData) => {
          //add new document to documents
          this.documents.push(responseData.document);
          //this.sortAndSend();
          this.storeDocuments();
        });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    //newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.storeDocuments();
        }
      );
  }

  storeDocuments() {
    this.documentListChangedEvent.next(this.documents.slice());
    // // convert documents array to string format
    // const stringDocs = JSON.stringify(this.documents);

    // //create HttpHeaders object & set content-type to application/json
    // const headers = new HttpHeaders().set('content-type', 'application/json');

    // // call put() to send document list to database
    // this.http.put('https://ehccms-76c34-default-rtdb.firebaseio.com/documents.json', stringDocs, { headers })
    //   .subscribe(data => {
    //     //emits documentListChnagedEvent & pass cloned copy of doc array
    //     this.documentListChangedEvent.next(this.documents.slice());
    //   });
  }
}
