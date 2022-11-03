import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-docente',
  templateUrl: './crud-docente.component.html',
  styleUrls: ['./crud-docente.component.css']
})
export class CrudDocenteComponent implements OnInit {

  //Para la Grilla
   docentes: Docente [] = [];
   filtro: string ="";
 
   //Para el ubigeo
   departamentos: string[] = [];;
   provincias: string[] = [];;
   distritos: Ubigeo[] = [];;

   
  //Json para registrar o actualizar
  docente: Docente = { 
    idDocente:0,
    nombre:"",
    dni:"",
    estado:1,
    ubigeo:{
      idUbigeo: -1,
      departamento:"-1",
      provincia:"-1",
      distrito:"-1",
    }
  };

  constructor(private docenteService:DocenteService, private ubigeoService:UbigeoService) {
      this.ubigeoService.listarDepartamento().subscribe(
          response => this.departamentos = response
      );            
  }

  cargaProvincia(){
      this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
        response =>  this.provincias= response
      );
      this.docente.ubigeo!.provincia = "-1";
      this.distritos = [];
      this.docente.ubigeo!.idUbigeo = -1;
  }

  cargaDistrito(){
    this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
      response =>  this.distritos= response
     );
     this.docente.ubigeo!.idUbigeo = -1;
   }

  ngOnInit(): void {
  }

  consulta(){
        this.docenteService.consultaDocente(this.filtro==""?"todos":this.filtro).subscribe(
           x => this.docentes = x
        );
  }

  registra(){
        this.docenteService.registraDocente(this.docente).subscribe(
            x => {
                 Swal.fire('Mensaje',x.mensaje,'info');
                 document.getElementById("btn_reg_limpiar")?.click();
            }
        );
  }

  busca(obj:Docente){
      console.log("obj.nombre>>> " + obj.nombre );
      this.docente = obj;
      
      this.ubigeoService.listaProvincias(this.docente.ubigeo!.departamento).subscribe(
          x =>  this.provincias= x
      );
      
      this.ubigeoService.listaDistritos(this.docente.ubigeo!.departamento, this.docente.ubigeo!.provincia).subscribe(
          x =>  this.distritos= x
       );
  }

  actualiza(){
    this.docenteService.actualizaDocente(this.docente).subscribe(
        x => {
            Swal.fire('Mensaje',x.mensaje,'info')
            document.getElementById("btn_act_limpiar")?.click();
        }
    );
  }

  actualizaEstado(obj:Docente){
    obj.estado = obj.estado == 1 ? 0 : 1;
    this.docenteService.actualizaDocente(obj).subscribe();
  }

}
