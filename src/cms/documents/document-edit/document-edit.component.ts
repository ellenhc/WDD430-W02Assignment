import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document; //  origianl, unedited version
  document: Document; // edited version of the document
  editMode: boolean = false; // indicates whether an existing doc is being edited, or a new one is being created

  constructor() { }

  ngOnInit(): void {
  }

  onCancel(){}

  onSubmit(f){}
}
