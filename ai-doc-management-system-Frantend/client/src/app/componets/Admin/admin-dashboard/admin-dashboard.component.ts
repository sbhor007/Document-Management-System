import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../service/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { UserNavbarComponent } from '../../user-navbar/user-navbar.component';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    FormsModule,
    CommonModule,
    NavbarComponent,
    RouterOutlet,
    UserNavbarComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  user: string = '';
  searchTerm: string = '';
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  isSortByName: boolean = false; // Flag to track sorting by name
  isSortByEmail: boolean = false; // Flag to track sorting by roll
  isSortByStorage: boolean = false; // Flag to track sorting by storage size
  isSortByDocuments: boolean = false; // Flag to track sorting by documents
  isSortByFolders: boolean = false; // Flag to track sorting by folders
  isSortByDate: boolean = false; // Flag to track sorting by date

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadCurrentUser();
    this.loadAllUsers();
  }

  loadCurrentUser(): void {
    this.usersService.getUser().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.user = response.data.name;
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      },
    });
  }

  loadAllUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.allUsers = response.data;
          this.filteredUsers = [...this.allUsers];
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      },
    });
  }

  searchUser(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.allUsers];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.userName.toLowerCase().includes(term) ||
        (user.roll && user.roll.toLowerCase().includes(term))
    );
  }

  viewUser(user: any): void {
    console.log('Viewing user details:', user);
    // Implement navigation to user detail page or open modal
  }

  deleteUser(userId: number, event: Event): void {
    event.stopPropagation(); // Prevent row click event from triggering
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user with ID:', userId);
      // Implement the actual delete functionality here
      // You would need to add a delete method to your UsersService
      // this.usersService.deleteUser(userId).subscribe({
      //   next: () => {
      //     this.allUsers = this.allUsers.filter(user => user.id !== userId);
      //     this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
      //   },
      //   error: (error) => {
      //     console.error('Error deleting user:', error);
      //   }
      // });
    }
  }

  getUsedStorageSize(user: any): number {
    if (!user.documents || !Array.isArray(user.documents)) {
      return 0;
    }

    // Assuming each document has a size property in bytes
    const totalBytes = user.documents.reduce((sum: number, doc: any) => {
      return sum + (doc.size || 0); // size should be in bytes
    }, 0);

    // Convert bytes to megabytes (1 MB = 1048576 bytes)
    return totalBytes / 1048576;
  }

  // Calculate total documents for a user
  getTotalDocuments(user: any): number {
    return user.documents ? user.documents.length : 0;
  }

  // Calculate total folders for a user
  getTotalFolders(user: any): number {
    return user.folders ? user.folders.length : 0;
  }

  sortByName(): void {
    this.isSortByName = !this.isSortByName;
    if (this.isSortByName) {
      this.filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.filteredUsers.sort((b, a) => a.name.localeCompare(b.name));
    }
  }

  sortByEmail(): void {
    this.isSortByEmail = !this.isSortByEmail;
    console.log("Again call");
    if(this.isSortByEmail) {
      this.filteredUsers.sort((a, b) => a.userName.localeCompare(b.userName));
    }else{
      this.filteredUsers.sort((b, a) => a.userName.localeCompare(b.userName));
    }
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/home']);
  }

}
