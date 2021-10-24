import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from 'src/cms/wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  id: string;
  nativeWindow: any;

  constructor(private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private windowRefService: WindRefService) {
    this.nativeWindow = windowRefService.getNativeWindow();
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.document = this.documentService.getDocument(this.id);
        }
      );
  }

  onView() {
    //get the value of the url property of the Doc object
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    // route back to /documents url
    this.router.navigateByUrl('/documents');
  }
}
