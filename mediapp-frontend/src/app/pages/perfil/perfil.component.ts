import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  roles : any;
  count : number=0;
  constructor(

  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;

    let rol=decodedToken.authorities.forEach(element => {
      if(this.count==0){
        this.roles=element;
      }else{
        this.roles=this.roles+","+element;
      }
      this.count++;
    });
  }

}
