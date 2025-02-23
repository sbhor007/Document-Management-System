import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-document',
  imports: [],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit {

  @Input() document:any;

  ngOnInit(): void {
    console.log('type',typeof(this.document));
    
      console.log("Documents",this.document);
      
  }

  openDocument(){}
}
