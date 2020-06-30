import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../models/cliente';

@Component({
  selector: 'app-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrls: ['./seleccionar-cliente.component.scss']
})
export class SeleccionarClienteComponent implements OnInit {
   clientes: Cliente[] = new Array<Cliente>();
   @Input('nombre') nombre : string;
   @Output('seleccionoCliente') seleccionoCliente = new EventEmitter();
   @Output('canceloCliente') canceloCliente = new EventEmitter();

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection<any>('clientes').get().subscribe((resultado)=>{
      this.clientes.length = 0;
      resultado.docs.forEach((item)=>{
        let cliente: any = item.data();
        cliente.id = item.id;
        cliente.ref = item.ref;
        cliente.visible = false;
        this.clientes.push(cliente);
      })

      console.log(this.clientes);
      
    })
  }

  buscarClientes(nombre: string){
    this.clientes.forEach((cliente)=>{
      if(cliente.nombre.toLowerCase().includes(nombre)){
        cliente.visible = true;
      }
      else{
        cliente.visible = false; 
      }
    })
    
  }


  seleccionarCliente(cliente:Cliente) /* Funcion que se ejecuta al darle click a un cliente */
  {
    this.nombre = cliente.nombre + ' ' + cliente.apellido /* Carga la variable global con el nombre y apellido del cliente */
    this.clientes.forEach((cliente)=>{ //Codigo para borrar los clientes de la lista una vez se ha escogido uno
      cliente.visible = false;
    })
    this.seleccionoCliente.emit(cliente) /* Variable creada para que otro componente se suscriba */
  }

  cancelarCliente(){ /* Funcion que ejecuta el boton CANCELAR */
    this.nombre = undefined; /* Borro el contenido del input */
    this.canceloCliente.emit();
  }



}
