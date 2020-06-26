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
  constructor(private afAuth: AngularFireAuth)
  {
    this.afAuth.user.subscribe((usuario)=>{
    setTimeout(()=>{
      this.cargando = false;
      this.usuario = usuario;
    },1000)

   
    })
  }
  login() {
    this.afAuth.signInWithEmailAndPassword('valen@gmail.com', '123456');
  }
  logout() {
    this.afAuth.signOut();
}
}
