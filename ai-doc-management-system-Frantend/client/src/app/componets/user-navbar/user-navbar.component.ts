import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { DocumentService } from '../../service/document.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FolderService } from '../../service/folder.service';

@Component({
  selector: 'app-user-navbar',
  imports: [CommonModule,FormsModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css',
  
})
export class UserNavbarComponent implements OnInit {
  documents:any[] = []
  folders:any[] = []
  constructor(
    private router: Router,
    private authService: AuthService,
    private documentService: DocumentService,
    private folderService: FolderService
  ) {}
  ngOnInit(): void {    
    this.documents=this.documentService.openedDocument
    this.folders=this.folderService.openedFolders
  }

  mainMenu = [
    { icon: 'fas fa-home', label: 'Home', route: '/user-dashboard' },
    { icon: 'fas fa-file', label: 'Own.docs', route: '/own-docs' },
    { icon: 'fas fa-university', label: 'University', route: '/university' },
    {
      icon: 'fas fa-folder',
      label: 'Doc.management',
      route: '/doc-management',
    },
  ];

  // recentlyOpened = [
  //   'AI_docmanagement',
  //   'BusinessIntelligence',
  //   'Tips_AI_docmanage',
  //   'Keys_docmanageme',
  //   'FilecontrolwithAI',
  // ];


  viewDocument(event: Event,document:any) {
    event.stopPropagation();
    this.router.navigate(['/documents/view-document'], {
      state: { document: document }
    });
  }

  openFolder(event: Event,myFolder: any) {
    event.stopPropagation();
    // console.log('Folder Opened', myFolder);
    // this.myTost.success('Folder Opened');
    this.folderService.addOpenedFolder(myFolder);
    this.router.navigate(['/documents/details', myFolder.folderId], {
      state: { documents: myFolder },
    });
  }
  goHome(event:any){
    event.stopPropagation()
    this.router.navigate(['/user-dashboard'])
  }

  logout() {
    this.authService.logOut();
    this.documentService.openedDocument =[]
    this.router.navigate(['/home']);
  }
  navigate(path: string) {
    
    this.router.navigate([path]);
    // this.router.navigateByUrl('/user-dashboard')
  }
}
