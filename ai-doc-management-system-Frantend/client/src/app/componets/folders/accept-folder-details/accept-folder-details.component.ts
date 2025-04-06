import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FolderService } from '../../../service/folder.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-accept-folder-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './accept-folder-details.component.html',
  styleUrl: './accept-folder-details.component.css',
})
export class AcceptFolderDetailsComponent implements OnInit {
  @Input() folderId: number = 0; // 0 means create, >0 means update
  @Input() folder: any; // Optional: Pass full folder object for pre-filling
  @Output() folderUpdated = new EventEmitter<void>();
  @Output() folderCreated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  createFolderForm: FormGroup;
  isVisible: boolean = true;
  parentFolderId: number | null = null;

  constructor(
    private router: Router,
    private folderService: FolderService,
    private fb: FormBuilder
  ) {
    this.createFolderForm = this.fb.group({
      folderName: ['', [Validators.required, Validators.minLength(3)]],
      folderDescription: ['', [Validators.required, Validators.minLength(5)]],
      parentFolderId : this.parentFolderId
    });
  }

  ngOnInit(): void {
    console.log('AcceptFolderDetailsComponent initialized with folderId:', this.folderId);
    if (this.folderId > 0 && this.folder) {
      this.createFolderForm.patchValue({
        folderName: this.folder.folderName,
        folderDescription: this.folder.folderDescription,
      });
    }
  }

  get folderName() {
    return this.createFolderForm.get('folderName');
  }

  get folderDescription() {
    return this.createFolderForm.get('folderDescription');
  }

  

  submitForm() {
    // console.log(`submit Form : accept`);
    
    if (this.createFolderForm.valid) {
      const folderData = this.createFolderForm.value;
      const serviceCall = this.folderId > 0
        ? this.folderService.updateFolder(this.folderId, folderData)
        : this.folderService.createFolder(folderData);
        // console.log(serviceCall);
        
      serviceCall.subscribe({
        next: (data) => {
          console.log(this.folderId > 0 ? 'Folder updated:' : 'Folder created:', data);
          if (this.folderId > 0) {
            this.folderUpdated.emit();
            alert('Folder updated successfully');
          } else {
            this.folderCreated.emit();
            alert('Folder created successfully');
          }
          this.close();
        },
        error: (error) => {
          console.error(this.folderId > 0 ? 'Error updating folder:' : 'Error creating folder:', error);
          if (error.status === 404) {
            alert('Folder not found. It may have been deleted.');
          } else {
            alert(`Operation failed: ${error.error?.message || 'Unknown error'}`);
          }
        },
      });
    } else {
      this.createFolderForm.markAllAsTouched();
    }
  }

  close() {
    this.isVisible = false;
    setTimeout(() => {
      this.closeModal.emit();
    }, 300); // Match the animation duration
  }
}
