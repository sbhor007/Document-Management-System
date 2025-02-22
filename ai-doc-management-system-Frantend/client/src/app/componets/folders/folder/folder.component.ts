import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent implements OnInit {

  @Input() folder:any

  constructor(private router:Router){}

  ngOnInit() {
    console.log(this.folder);
    
  }

  openFolder() {
    alert("Folder Operned");

    this.router.navigate(['/documents'], { state: { folder: this.folder } });
  }
}
