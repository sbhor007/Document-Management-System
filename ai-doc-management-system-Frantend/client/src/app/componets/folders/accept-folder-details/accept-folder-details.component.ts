import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-accept-folder-details',
  imports: [CommonModule],
  templateUrl: './accept-folder-details.component.html',
  styleUrl: './accept-folder-details.component.css'
})
export class AcceptFolderDetailsComponent {
  isVisible:boolean = true
  closeFolderDetails(){}
  acceptFolder(){}
  rejectFolder(){}
  openFolder(){}
  close(){
    this.isVisible = !this.isVisible
  }
}
