import { Component } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-acercade',
  standalone: true,
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './acercade.component.html',
  styleUrl: './acercade.component.css'
})
export class AcercadeComponent {

}
