import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {

  nombre = '';
  apellido_paterno = '';
  apellido_materno = '';
  tipo_identificacion = '';
  numero_identificacion = '';
  celular = '';
  correo = '';
  password = '';
  confirmPassword = '';

  generalError = '';

  errorCorreo = '';
  errorCelular = '';
  errorPassword = '';
  errorConfirmPassword = '';

  successMessage = '';

  constructor(private router: Router, private auth: AuthService) { }

  filtrarTexto(event: any, campo: 'nombre' | 'apellido_paterno' | 'apellido_materno') {
    const value = event.target.value;

    const limpio = value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, '');

    this[campo] = limpio;
    event.target.value = limpio;
  }

  filtrarCelular(event: any) {
    const value = event.target.value;

    let limpio = value
      .replace(/[^0-9+]/g, '')
      .replace(/(?!^)\+/g, '');

    this.celular = limpio;
    event.target.value = limpio;
  }

  onTipoChange() {
    this.numero_identificacion = '';
  }

  filtrarIdentificacion(event: any) {
    let value = event.target.value;

    if (this.tipo_identificacion === 'PASAPORTE') {
      value = value.replace(/[^a-zA-Z0-9]/g, '');
    } else {
      value = value.replace(/\D/g, '');
    }

    this.numero_identificacion = value;
    event.target.value = value;
  }

  register() {

    this.generalError = '';

    this.errorCorreo = '';
    this.errorCelular = '';
    this.errorPassword = '';
    this.errorConfirmPassword = '';

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let hasError = false;

    if (
      !this.nombre ||
      !this.apellido_paterno ||
      !this.tipo_identificacion ||
      !this.numero_identificacion ||
      !this.celular ||
      !this.correo ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.generalError = 'Completa los campos obligatorios';
      hasError = true;
    }

    if (this.correo && !regexCorreo.test(this.correo)) {
      this.errorCorreo = 'Correo inválido';
      hasError = true;
    }

    if (this.celular && this.celular.length < 8) {
      this.errorCelular = 'Número inválido';
      hasError = true;
    }

    if (this.password && this.password.length < 8) {
      this.errorPassword = 'Mínimo 8 caracteres';
      hasError = true;
    }

    if (this.password !== this.confirmPassword) {
      this.errorConfirmPassword = 'No coinciden';
      hasError = true;
    }

    if (hasError) return;

    const data = {
      nombre: this.nombre,
      apellido_paterno: this.apellido_paterno,
      apellido_materno: this.apellido_materno,
      tipo_identificacion: this.tipo_identificacion,
      numero_identificacion: this.numero_identificacion,
      celular: this.celular,
      correo: this.correo,
      password: this.password
    };

    this.auth.register(data).subscribe({
      next: () => {
        this.successMessage = 'Cuenta creada correctamente';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        this.generalError = err.error?.error || 'Error en registro';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}