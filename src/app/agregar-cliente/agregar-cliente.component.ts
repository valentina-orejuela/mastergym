import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  porcentajeSubida: number = 0;
  urlImagen: string = '';
  esEditable: boolean = false;
  id: string;



  constructor(
    private fb: FormBuilder, 
    private storage: AngularFireStorage, 
    private db: AngularFirestore, 
    private activeRoute: ActivatedRoute) { }

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

    this.id = this.activeRoute.snapshot.params.clienteID;

    if (this.id != undefined) 
    {
      this.esEditable = true;
      this.db.doc<any>('clientes'+ '/' + this.id).valueChanges().subscribe((cliente)=> /* Leo en la base de datos el cliente con la id dada */
    
    {
      console.log(cliente) 
      this.formularioCliente.setValue({ 
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        correo: cliente.correo,
        fechaNacimiento: new Date(cliente.fechaNacimiento.seconds * 1000).toISOString().substr(0,10), 
        telefono: cliente.telefono,
        cedula: cliente.cedula,
        ImgUrl: ''/* Relleno para evitar error */
        
      })

      this.urlImagen = cliente.imgUrl; /* El formato imagen se debe definir así */

    });
    } 

  }

  agregar(){
    this.formularioCliente.value.ImgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento)
    console.log(this.formularioCliente.value);
    this.db.collection('clientes').add(this.formularioCliente.value).then((termino)=>{
      // this.msj.mensajeCorrecto('Agregar',('Se agregó correctamente')) 
      this.formularioCliente.reset(); 
    })
  }

  editar()
  {
    this.formularioCliente.value.imgUrl = this.urlImagen /* Asginamos a la variable del formulario la URL de la imagen de la BD */
    this.formularioCliente.value.fechaNacimiento = new Date (this.formularioCliente.value.fechaNacimiento) /* Damos el formato a la fecha de string a date */
    // this.db.doc('clientes/' + this.id).update(this.formularioCliente.value).then((resultado)=>{
    //   this.msj.mensajeCorrecto('Editar',('Se editó correctamente')) /* Invoco servicio de correcto de SWEETALERT de mensaje correcto */
    // }).catch(()=>{
    //   this.msj.mensajeError('Error',('Ocurrió algun error')) /* Invoco servicio de error de SWEETALERT de mensaje correcto */
    // })
  }

  subirImagen(evento)
  {

    if(evento.target.files.length > 0)
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

}
