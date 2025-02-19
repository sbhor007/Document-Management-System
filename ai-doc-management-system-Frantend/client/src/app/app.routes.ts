import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './componets/home-layout/home-layout.component';
import { HomeComponent } from './componets/home/home.component';
import { LoginComponent } from './componets/login/login.component';
import { RegisterComponent } from './componets/register/register.component';
import { UserDashboardComponent } from './componets/user-dashboard/user-dashboard.component';
import { DashBoardLayoutComponent } from './componets/dash-board-layout/dash-board-layout.component';
import path from 'path';
import { Component } from '@angular/core';

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
        component:DashBoardLayoutComponent,
        children: [
          {
            path: 'dashboard',
            component: UserDashboardComponent
          }
        ]
      }
];
