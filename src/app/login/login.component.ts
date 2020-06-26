import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  [x: string]: any;
  formularioLogin: FormGroup;
  datosCorrectos: boolean = true;
  textoError: string = '';
  constructor(private crearFormulario: FormBuilder, private afAuth: AngularFireAuth, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formularioLogin = this.crearFormulario.group({
       email: ['', Validators.compose([
         Validators.required, Validators.email
       ])],
       password: ['', Validators.required]
    });
  }

  ingresar(){
    if(this.formularioLogin.valid)
    {
      this.datosCorrectos = true;
      this.spinner.show();
      this.afAuth.signInWithEmailAndPassword(this.formularioLogin.value.email, this.formularioLogin.value.password).then((usuario) => {
        console.log(usuario);
        this.spinner.hide();
      }).catch((Error)=>{
        this.datosCorrectos = false;
        this.textoError = Error.message;
        this.spinner.hide();
      })
    }
    else
    {
      this.datosCorrectos = false;
      this.textoError = "Por favor revisa que los datos esten correctos"
    }

  }

}
