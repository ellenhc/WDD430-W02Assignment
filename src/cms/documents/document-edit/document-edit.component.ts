import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document; //  original, unedited version
  document: Document; // edited version of the document
  editMode: boolean = false; // indicates whether an existing doc is being edited, or a new one is being created

  constructor(private documentService: DocumentService,
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
        this.originalDocument = this.documentService.getDocument(id);

        if (!this.originalDocument) {
          return;
        } //endif
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      })
  }

  onCancel() {
    this.router.navigateByUrl('/documents');
  }

  onSubmit(f: NgForm) {
    const value = f.value;
    const newDocument = new Document(value.id, value.name, value.description, value.url, []);
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    }
    else {
      this.documentService.addDocument(newDocument);
    }
    // route back to '/documents' URL
    this.router.navigateByUrl('/documents');
  }
}
