import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-layout.html',
  styleUrls: ['./candidate-layout.css']
})
export class CandidateLayoutComponent {

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}