import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  correo: string = '';
  password: string = '';
  correoError: string = '';
  passwordError: string = '';

  constructor(private router: Router, private auth: AuthService) { }

  validateFields() {

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.correo) {
      this.correoError = 'El correo electrónico es obligatorio';
    } else if (!regexCorreo.test(this.correo)) {
      this.correoError = 'Formato inválido';
    } else {
      this.correoError = '';
    }

    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria';
    } else if (this.password.length < 8) {
      this.passwordError = 'Mínimo 8 caracteres';
    } else {
      this.passwordError = '';
    }
  }

  login() {

    this.validateFields();

    if (this.correoError || this.passwordError) {
      return;
    }

    const usuarioMock = {
      id: 2,
      correo: this.correo,
      rol: 'CANDIDATO'
    };

    const tokenMock = 'mock-token-123';

    this.auth.setToken(tokenMock);
    localStorage.setItem('usuario', JSON.stringify(usuarioMock));

    this.router.navigate(['/candidato/home']);
  }

  goToRecover() {
    // por ahora solo redirige a una ruta vacía
    alert('Pantalla de recuperación próximamente');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}