import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  createFolderForm: FormGroup;
  isVisible: boolean = true;

  constructor(
    private router: Router,
    private folderService: FolderService,
    private fb: FormBuilder
  ) {
    this.createFolderForm = this.fb.group({
      folderName: ['', [Validators.required]],
      folderDescription: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    console.log('AcceptFolderDetailsComponent initialized');
  }

  get folderName(){
    return this.createFolderForm.get('folderName');
  }
  get folderDescription(){
    return this.createFolderForm.get('folderDescription');
  }

  createFolder() {
    console.log('createFolderForm', this.createFolderForm.value);
    
    if(this.createFolderForm.valid){
      this.folderService.createFolder(this.createFolderForm.value).subscribe((data)=>{
        console.log(data);
        // this.router.navigate(['/folders']);
        alert('Folder created successfully');
        this.close();
      },
      (error)=>{
        console.log(error);
        alert('Folder creation failed');
        
      }
    )
    }
  }

  close() {
    this.isVisible = !this.isVisible;
  }
  acceptFolderDetails(folderDetails: any) {
    this.folderService.createFolder(folderDetails).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/folders']);
    });
  }
}
