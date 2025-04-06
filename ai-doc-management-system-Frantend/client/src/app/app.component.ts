import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private authService:AuthService){}
  ngOnInit(): void {
  //  console.log("Window closed : ",window.closed);
  //  if(window.closed){
  //   this.authService.logOut()
  //  }
  // window.onload = () =>{
  //   this.authService.logOut()
  // }
   
   
  }
  title = 'client';
  
}
