import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
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

  localStorage.removeItem('token');

  this.auth.login({ correo: this.correo, password: this.password }).subscribe({
    next: (res) => {
      const token = res?.token;
      const usuario = res?.usuario;

      if (typeof token === 'string' && token.split('.').length === 3) {

        this.auth.setToken(token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        if (usuario?.rol === 'ADMIN') {
          this.router.navigate(['/admin']); 
        } else {
          this.router.navigate(['/candidato/home']);
        }

      } else {
        localStorage.removeItem('token');
        this.correoError = 'No se recibió token válido del servidor';
        console.error('Respuesta de login sin token válido:', res);
      }
    },
    error: (err) => {
      localStorage.removeItem('token');
      console.error('Error en login:', err);
      const mensaje = err.error?.mensaje || err.error?.error || 'Credenciales inválidas';
      this.passwordError = mensaje;
    }
  });
  
}

  goToRecover() {
    // por ahora solo redirige a una ruta vacía
    alert('Pantalla de recuperación próximamente');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}