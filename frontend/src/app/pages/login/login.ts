import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  correo: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    console.log('Login:', this.correo, this.password);

    // conexión a backend pendiente
  }

  goToRecover() {
  // por ahora solo redirige a una ruta vacía
  alert('Pantalla de recuperación próximamente');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
