import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() folderCreated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
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
        this.folderCreated.emit();
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
  updateFolderData(){
    this.folderService.getAllFolders().subscribe(folders =>{
      console.log(`updated folders : ${folders}`);
      alert("Foldes Updated")
    },
    (error) =>{
      console.log(`error while updating folders : ${error}`);
    }
  )
  }

  close() {
    this.isVisible = false;
    this.folderCreated.emit();
  }
  acceptFolderDetails(folderDetails: any) {
    this.folderService.createFolder(folderDetails).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/folders']);
    });
  }
}
