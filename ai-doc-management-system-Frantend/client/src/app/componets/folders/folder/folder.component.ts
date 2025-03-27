import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FolderService } from '../../../service/folder.service';
import { AcceptFolderDetailsComponent } from "../accept-folder-details/accept-folder-details.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder',
  imports: [AcceptFolderDetailsComponent,CommonModule],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css',
})
export class FolderComponent implements OnInit {
  @Input() folder: any;
  @Output() folderDeleted = new EventEmitter<void>();
  @Output() folderUpdated = new EventEmitter<void>()
  isVisible:boolean=false

  constructor(
    private router: Router,
    private myTost: ToastrService,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    console.log(this.folder);
  }

  openFolder(myFolder: any) {
    console.log('Folder Opened', myFolder);
    this.myTost.success('Folder Opened');
    this.router.navigate(['/documents/details', myFolder.folderId], {
      state: { documents: myFolder },
    });
  }

  viewFolder(event: Event) {
    event.stopPropagation();
    
    this.folderService.getFolderDetails(this.folder.folderId).subscribe({
      next: (response: any) => {
        console.log('Folder Details:', response);
        this.myTost.info('Folder details fetched');
        this.router.navigate(['/documents/details', this.folder.folderId], {
          state: { documents: response.data || this.folder },
        });
      },
      error: (error) => {
        console.error('Error fetching folder details:', error);
        this.myTost.error('Failed to fetch folder details');
      },
    });
  }

  // updateFolder(){
  //   this.isVisible = !this.isVisible 
  // }

  renameFolder(event: Event) {
    event.stopPropagation();
    const newName = prompt('Enter new name for folder:', this.folder.folderName);
    if (newName && newName.trim() !== '') {
      const updatedFolder = { ...this.folder, folderName: newName.trim() };
      
    }
  }

  deleteFolder(event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${this.folder.folderName}"?`)) {
      this.folderService.deleteFolder(this.folder.folderId).subscribe({
        next: () => {
          this.myTost.success('Folder deleted successfully');
          this.folderDeleted.emit(); // Emit event to notify parent
          // Optionally remove navigation if you want to stay on the dashboard
          // this.router.navigate(['/user-dashboard']); 
        },
        error: (error) => {
          console.error('Error deleting folder:', error);
          this.myTost.error('Failed to delete folder');
        },
      });
    }
  }

  onFolderUpdated() {
    this.folderUpdated.emit();
    this.isVisible = false;
  }

  updateFolder(event: Event) {
    // event.stopPropagation();
    this.isVisible = true; // Show modal
  }
  
  onCloseModal() {
    this.isVisible = false;
  }
  
}
