import { Component, OnInit } from '@angular/core';
import { UserNavbarComponent } from "../../user-navbar/user-navbar.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-document-layout',
  imports: [ UserNavbarComponent, RouterModule],
  templateUrl: './document-layout.component.html',
  styleUrl: './document-layout.component.css'
})
export class DocumentLayoutComponent implements OnInit {
  constructor(private router:Router){}
  ngOnInit(): void {
  }
  searchDocument(){}
}
