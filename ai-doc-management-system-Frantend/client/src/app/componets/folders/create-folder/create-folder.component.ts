import { Component } from '@angular/core';
import { AcceptFolderDetailsComponent } from "../accept-folder-details/accept-folder-details.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-folder',
  imports: [AcceptFolderDetailsComponent,CommonModule],
  templateUrl: './create-folder.component.html',
  styleUrl: './create-folder.component.css'
})
export class CreateFolderComponent {
  isVisible:boolean=false
  createNewFolder()
  {
    this.isVisible = !this.isVisible
  }
}
