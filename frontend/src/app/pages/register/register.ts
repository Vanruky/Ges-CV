import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
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

  constructor(private router: Router, private auth: AuthService) { }

  register() {

    if (
      !this.nombre ||
      !this.apellido_paterno ||
      !this.tipo_identificacion ||
      !this.numero_identificacion ||
      !this.celular ||
      !this.correo ||
      !this.password
    ) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

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
      next: (res: any) => {
        console.log(res);
        alert(res.mensaje || 'Cuenta creada correctamente'); 
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error?.error || 'Error en registro');
      }
    });

  }

  goToLogin() {
    this.router.navigate(['/']);
  }

}
