import { Component, EventEmitter, Output } from '@angular/core';
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
  
  // @Output() folderUpdated = new EventEmitter<void>();
  @Output() folderCreated = new EventEmitter<void>();
  @Output() folderUpdated = new EventEmitter<void>();
  isVisible:boolean=false

  constructor(private router:Router, private folderService:FolderService) { }

  createNewFolder()
  {
    this.isVisible = !this.isVisible
    // this.toster.success('Folder Created Successfully');
  }

  onFolderCreated() {
    this.folderCreated.emit();
    alert('Folder Created Successfully');
    // this.toster.success('Folder Created Successfully');
    this.isVisible = false;
  }
  updateFolder(){
    this.isVisible = !this.isVisible
    // this.toster.success('Folder Created Successfully');
  }
  onFolderUpdate(){
    this.folderUpdated.emit();
    alert('Folder Updated Successfully');
    // this.toster.success('Folder Created Successfully');
    this.isVisible = false;
  }
  onCloseModal() {
    this.isVisible = false;
  }  
}
