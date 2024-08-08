import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-seccion-team',
  standalone: true,
  imports: [FooterComponent, NavBarComponent],
  templateUrl: './seccion-team.component.html',
  styleUrl: './seccion-team.component.css'
})
export class SeccionTeamComponent {

}
