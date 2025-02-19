import { Component } from '@angular/core';
import { AcceptFolderDetailsComponent } from "../accept-folder-details/accept-folder-details.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FolderService } from '../../../service/folder.service';

@Component({
  selector: 'app-create-folder',
  imports: [AcceptFolderDetailsComponent,CommonModule],
  templateUrl: './create-folder.component.html',
  styleUrl: './create-folder.component.css'
})
export class CreateFolderComponent {
  isVisible:boolean=false

  constructor(private router:Router, private folderService:FolderService) { }

  createNewFolder()
  {
    this.isVisible = !this.isVisible
  }

  
}
