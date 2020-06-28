import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  porcentajeSubida: number = 0;
  urlImagen: string = ''
  constructor(private fb: FormBuilder, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      cedula: [''],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      ImgUrl: ['', Validators.required]
    })
  }

  agregar(){
    console.log(this.formularioCliente.value);
  }

  subirImagen(evento)
  {

    let nombre = new Date().getTime().toString()
    let archivo = evento.target.files[0]
    let extension = archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'))
    let ruta = 'clientes/' + nombre + extension;
    const referencia = this.storage.ref(ruta);
    const tarea = referencia.put(archivo);
    tarea.then((objecto)=>{
      console.log("imagen subida")
      referencia.getDownloadURL().subscribe((url)=>{ 
        this.urlImagen = url; 
      })
    })
    tarea.percentageChanges().subscribe((porcentaje)=>{
      this.porcentajeSubida = parseInt(porcentaje.toString());
      
    })
  }

}
