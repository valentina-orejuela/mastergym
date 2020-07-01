import { Component, OnInit } from '@angular/core';
import { Inscripcion } from '../models/inscripcion';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-listado-inscripciones',
  templateUrl: './listado-inscripciones.component.html',
  styleUrls: ['./listado-inscripciones.component.scss']
})
export class ListadoInscripcionesComponent implements OnInit {
  inscripciones: any[] = [];
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection('inscripciones').get().subscribe((resultado)=>{
      resultado.forEach((Inscripcion)=>{
        let inscripcionObtenida = Inscripcion.data();
        inscripcionObtenida.id = Inscripcion.id;

        this.db.doc(Inscripcion.data().cliente.path).get().subscribe((cliente)=>{
          
          inscripcionObtenida.clienteObtenido = cliente.data();
          inscripcionObtenida.fecha = new Date(inscripcionObtenida.fecha.seconds * 1000);
          inscripcionObtenida.fechaFinal = new Date(inscripcionObtenida.fechaFinal.seconds * 1000 );
          this.inscripciones.push(inscripcionObtenida);
        })
      });
    })
  }

}
