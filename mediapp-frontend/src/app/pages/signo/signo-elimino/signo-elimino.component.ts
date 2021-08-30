import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Signo } from './../../../_model/signo';
import { SignoService } from './../../../_service/signo.service';

@Component({
  selector: 'app-signo-elimino',
  templateUrl: './signo-elimino.component.html',
  styleUrls: ['./signo-elimino.component.css']
})
export class SignoEliminoComponent implements OnInit {
  paciente: string;
  codigo: number;
  signo: Signo;
    constructor(
    private dialogRef: MatDialogRef<SignoEliminoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Signo,
    private signoService : SignoService
  ) { }

  ngOnInit(): void {
    this.signo = new Signo();
    this.signo.idSigno = this.data.idSigno;
    this.paciente=this.data.paciente.nombres + " " + this.data.paciente.apellidos;
    this.codigo = this.data.idSigno;
  }

  operar(){
    if (this.signo != null && this.signo.idSigno > 0) {
      this.signoService.eliminar(this.signo.idSigno).pipe(switchMap(() => {
        return this.signoService.listar();
      })).subscribe(data => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio('Se eliminó');
      });
    }
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close();
  }
}
