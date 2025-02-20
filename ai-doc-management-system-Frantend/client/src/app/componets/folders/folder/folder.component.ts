import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-folder',
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent implements OnInit {

  @Input() folder:any

  ngOnInit() {
    console.log(this.folder);
    
  }

  openFolder() {}
}
