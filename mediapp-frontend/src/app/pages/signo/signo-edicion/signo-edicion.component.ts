import { ActivatedRoute, Router, Params } from '@angular/router';
import { SignoService } from './../../../_service/signo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Signo } from './../../../_model/signo';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import * as moment from 'moment';
@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {
  fechaSeleccionada: Date = new Date();
  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;
  idPacienteSeleccionado: number;
  maxFecha: Date = new Date();
  id: number;
  signo: Signo;
  form: FormGroup;
  edicion: boolean = false;
  pacienteSelect :number;
  constructor(
    private pacienteService: PacienteService,
    private signoService: SignoService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.listarPacientes();
    this.signo = new Signo();
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': new FormControl(''),
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl(''),
    });


    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe(data => {
        let id = data.idSigno;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmoRespiratorio = data.ritmoRespiratorio
        let fecha = data.fecha;
        this.pacienteSelect = data.paciente.idPaciente;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmoRespiratorio': new FormControl(ritmoRespiratorio),
          'fecha': new FormControl(fecha),
          'paciente': new FormControl(this.pacienteSelect),
        });
      });
    }
  }

  operar() {
    this.signo.idSigno = this.form.value['id'];
    this.signo.temperatura = this.form.value['temperatura'];
    this.signo.pulso = this.form.value['pulso'];
    this.signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    this.signo.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    let paciente = new Paciente();
    if(this.idPacienteSeleccionado!=null){
      paciente.idPaciente =this.idPacienteSeleccionado;
    }else{
      paciente.idPaciente = this.pacienteSelect;
    }
    this.signo.paciente = paciente;
    if (this.signo != null && this.signo.idSigno > 0) {
      //BUENA PRACTICA
      this.signoService.modificar(this.signo).pipe(switchMap(() => {
        return this.signoService.listar();
      })).subscribe(data => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio("Se modifico");
      });
    } else {
      //PRACTICA COMUN
      this.signoService.registrar(this.signo).subscribe(data => {
        this.signoService.listar().subscribe(especialidad => {
          this.signoService.setSignoCambio(especialidad);
          this.signoService.setMensajeCambio("Se registro");
        });
      });
    }
    setTimeout(() => {
      this.limpiarControles();
    }, 2000)
    this.router.navigate(['/pages/signo']);
  }

  listarPacientes() {
    this.pacientes$ = this.pacienteService.listar();
  }
  limpiarControles() {

    this.idPacienteSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }
}
