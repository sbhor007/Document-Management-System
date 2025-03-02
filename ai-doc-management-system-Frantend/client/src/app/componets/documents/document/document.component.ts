import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document',
  imports: [],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit {

  @Input() document:any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    console.log('type',typeof(this.document));
    
      console.log("Documents",this.document);
      
  }

  openDocument(){
    this.router.navigate(['/documents/view-document',this.document])
    alert("document opened")
  }
}
