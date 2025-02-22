import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './componets/home-layout/home-layout.component';
import { HomeComponent } from './componets/home/home.component';
import { LoginComponent } from './componets/login/login.component';
import { RegisterComponent } from './componets/register/register.component';
import { DashBoardLayoutComponent } from './componets/dash-board-layout/dash-board-layout.component';
import { DocumentDetailsComponent } from './componets/documents/document-details/document-details.component';
import { DocumentLayoutComponent } from './componets/documents/document-layout/document-layout.component';
import { UploadDocumentsComponent } from './componets/documents/upload-documents/upload-documents.component';

// export const routes: Routes = [
//     {
//         path: '',
//         redirectTo: '/home',
//         pathMatch: 'full'
//       },
//       {
//         path: 'home',
//         component: HomeLayoutComponent,
//         children: [
//           {
//             path: '',
//             component: HomeComponent
//           },
//           {
//             path: 'login',
//             component: LoginComponent
//           },
//           {
//             path: 'register',
//             component: RegisterComponent
//           }
//         ]
//       },
//       {
//         path: 'user-dashboard',
//         component:DashBoardLayoutComponent,
//         children: [
//           // {
//           //   path: 'dashboard',
//           //   component: UserDashboardComponent
//           // },
          
//         ]
//       },
//       {
//         path:'documents-dashboard',
//         component:DocumentLayoutComponent,
//         children:[
//           {
//             path:'upload-document',
//             component:UploadDocumentsComponent
//           },
//           {
//             path:'document-details',
//             component:DocumentDetailsComponent
//           }
//         ]
//       }
// ];


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'user-dashboard',
    component: DashBoardLayoutComponent,
  },
  {
    path: 'documents',  // Changed from documents-dashboard for better URL structure
    component: DocumentLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'details/:folderId',
        component: DocumentDetailsComponent
      },
      {
        path: 'upload/:folderId',
        component: UploadDocumentsComponent
      }
    ]
  }
];