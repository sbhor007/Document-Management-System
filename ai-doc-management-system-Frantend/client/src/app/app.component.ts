import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashBoardLayoutComponent } from "./componets/dash-board-layout/dash-board-layout.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DashBoardLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
}
