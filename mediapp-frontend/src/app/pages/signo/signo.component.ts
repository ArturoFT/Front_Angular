import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Signo } from './../../_model/signo';
import { SignoService } from './../../_service/signo.service';
import { SignoEliminoComponent } from './signo-elimino/signo-elimino.component';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {
  displayedColumns = ['idSigno', 'paciente','temperatura', 'pulso', 'ritmoRespiratorio', 'acciones'];
  dataSource: MatTableDataSource<Signo>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  signoArray : Array<Signo> = [];
  constructor(
    private signoService: SignoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void  {
      this.signoService.getSignoCambio().subscribe(data => {
         this.pushTabla(data);
      });

      this.signoService.getMensajeCambio().subscribe(data => {
        this.snackBar.open(data, 'Aviso', { duration: 2000});
      })

      this.signoService.listar().subscribe(data => {
        this.pushTabla(data);
      })
    }

    filtrar(valor: string) {
      this.dataSource.filter = valor.trim().toLowerCase();
    }

    abrirDialogo(signo: Signo) {
      this.dialog.open(SignoEliminoComponent, {
        data: signo,
        width: '250px'
      });
    }

    crearTabla(data: Signo[]) {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    pushTabla(data: Signo[]){
      this.signoArray =[];
      data.map(x => {
        let Obj = {} as Signo;
        Obj.idSigno=x.idSigno;
        Obj.nombreCompleto=x.paciente.nombres + " " + x.paciente.apellidos;
        Obj.temperatura = x.temperatura;
        Obj.pulso = x.pulso;
        Obj.ritmoRespiratorio = x.ritmoRespiratorio;
        Obj.fecha= x.fecha
        Obj.paciente=x.paciente
        this.signoArray.push(Obj);
      });
      this.crearTabla(this.signoArray);
    }

}
