import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-folder',
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css',
})
export class FolderComponent implements OnInit {
  @Input() folder: any;

  constructor(private router: Router, private myTost: ToastrService) {}

  ngOnInit() {
    console.log(this.folder);
  }

  openFolder(myFolder: any) {
    alert("Folder Opened");
    console.log('Folder Opened', myFolder);

    this.myTost.success('Folder Opened');

    this.router.navigate(['/documents/details', myFolder.folderId], {
      state: { documents: myFolder },
    });
  }
  
}
