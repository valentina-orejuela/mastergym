import { Component } from '@angular/core';
import { auth, User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mastergym';
  usuario: User;
  cargando: boolean = true;
  constructor(public auth: AngularFireAuth)
  {
    this.auth.user.subscribe((usuario)=>{
    setTimeout(()=>{
      this.cargando = false;
      this.usuario = usuario;
    },1000)

   
    })
  }
  login() {
    this.auth.signInWithEmailAndPassword('valen@gmail.com', '123456');
  }
  logout() {
    this.auth.signOut();
}
}
