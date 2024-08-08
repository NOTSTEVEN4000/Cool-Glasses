import { Component, HostListener, OnInit} from '@angular/core';
import { Router, NavigationEnd, Event, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './web/shared/components/nav-bar/nav-bar.component';
import { FooterComponent } from './web/shared/components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent, FooterComponent, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CoolGlasses';
  constructor() {}

  ngOnInit() {}

  @HostListener('window:scroll', [])
   onWindowScroll() {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById('appear')?.classList.add('active')
    }
    else(
      document.getElementById('appear')?.classList.remove('active')
    )
  }
}
