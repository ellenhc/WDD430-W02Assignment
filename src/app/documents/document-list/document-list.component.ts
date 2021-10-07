import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document("1", "1st Document", "This is the first description.", "https://www.google.com/", null),
    new Document("2", "2nd Document", "This is the second description.", "https://www.google.com/", null),
    new Document("3", "3rd Document", "This is the third description.", "https://www.google.com/", null),
    new Document("4", "4th Document", "This is the fourth description.", "https://www.google.com/", null)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document){
    /*Emit the selectedDocumentEvent and pass it 
    the document object passed into the method.*/
    this.selectedDocumentEvent.emit(document);
  }

}
