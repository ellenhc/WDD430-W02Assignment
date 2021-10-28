import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  //@Output() selectedDocumentEvent = new EventEmitter<Document>();
  subscription: Subscription;

  documents: Document[] = [];

  constructor(private documentService: DocumentService) {
    this.documents = this.documentService.getDocuments();
  }

  ngOnInit() {
    //this.documents = this.documentService.getDocuments();

    this.subscription = this.documentService.documentListChangedEvent
      .subscribe((documentsList: Document[]) => {
        this.documents = documentsList;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
