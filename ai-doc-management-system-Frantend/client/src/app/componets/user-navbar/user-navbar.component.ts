import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FolderService } from '../../service/folder.service';

@Component({
  selector: 'app-user-navbar',
  imports: [],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {

  constructor(private router:Router,private authService:AuthService,private folderService:FolderService) { }

  mainMenu = [
    { icon: 'fas fa-home', label: 'Home', route: '/dashboard' },
    { icon: 'fas fa-file', label: 'Own.docs', route: '/own-docs' },
    { icon: 'fas fa-university', label: 'University', route: '/university' },
    { icon: 'fas fa-folder', label: 'Doc.management', route: '/doc-management' }
  ];

  recentlyOpened = [
    'AI_docmanagement',
    'BusinessIntelligence',
    'Tips_AI_docmanage',
    'Keys_docmanageme',
    'FilecontrolwithAI'
  ];

  logout() {
    this.authService.logOut();
    this.router.navigate(['/home']);
    }
}
