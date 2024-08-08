import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoComponent } from "../carrito/carrito.component"; // Importa CommonModule
import { Producto } from '../../../../core/models/producto.interface';
import { ConexProductosService } from '../../../../core/services/producto/product.service';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { AuthServiceService } from '../../../../core/services/seguridad/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, CarritoComponent], // Asegúrate de que CommonModule está incluido en imports
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'], // Corrige 'styleUrl' a 'styleUrls'
})
export class NavBarComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ConexProductosService);
  private authService = inject(AuthServiceService);
  private searchTerms = new Subject<string>();
  productos: Producto[] = [];

  isNovedadesOpen: boolean = false;
  isMenuCollapsed: boolean = true; // Estado del menú colapsado
  isCartSidebarOpen = false;
  isScrolled: boolean = false;
  searchTerm: string = '';
  isMobile: boolean = false;
  isSearchModalOpen: boolean = false;
  userRole: 'administrador' | 'cliente' | null = null;
  previousScrollPosition: number = window.scrollY;

  constructor() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => term ? this.productService.searchProductos(term) : of([]))
    ).subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }


  @HostListener('window:scroll', [])
  onScroll() {
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition > 50) {
      // Scrolling down from the top
      this.isScrolled = true;
    } else {
      // At the top of the page
      this.isScrolled = false;
    }
    this.previousScrollPosition = currentScrollPosition;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
    this.userRole = this.authService.getUserRole();
  }

  openSearchModal() {
    this.isSearchModalOpen = true;
  }

  closeSearchModal() {
    this.isSearchModalOpen = false;
    this.productos = [];
  }

  toggleNovedades() {
    this.isNovedadesOpen = !this.isNovedadesOpen;
  }

  closeNovedades() {
    this.isNovedadesOpen = false;
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  openCartSidebar() {
    this.isCartSidebarOpen = true;
    document.body.classList.add('no-scroll'); // Add no-scroll class when opening sidebar
  }

  closeCartSidebar() {
    this.isCartSidebarOpen = false;
    document.body.classList.remove('no-scroll'); // Remove no-scroll class when closing sidebar
  }

  handleSidebarClose() {
    this.isCartSidebarOpen = false;
  }

  //**** Método de redireccionamiento, donde le pasamos un parametro de tipo string la ruta inicial a donde queremos llegar****/
  //** Funcional para direccionamiento entre componentes de las pages **//
  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.trim();
    this.searchTerm = query; // Guardamos el término de búsqueda
    if (query) {
      this.searchTerms.next(query);
    } else {
      this.productos = [];
    }
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const query = this.searchTerm.trim();
      if (query) {
        this.productos = []; // Cierra el autocompletado
        this.router.navigate(['/resultados'], { queryParams: { query } }).then(() => {
          this.clearSearchInput(); // Limpia el campo de búsqueda
        });
      }
    }
  }

  clearSearchInput(): void {
    const searchInput = document.getElementById('search-navbar') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    this.searchTerm = '';
  }

  rutaScroll(route: string, productoId: string): void {
    this.router.navigate([route, productoId]).then(() => {
      window.location.reload();
      window.scrollTo(0, 0);
    });
  }
  
  logout() {
    this.authService.logout();
    this.userRole = null;
    Swal.fire({
      title: 'Se cerró la sesión Exitosamente!!',
      text: 'Vuelve pronto! :3',
      icon: 'success',
      confirmButtonText: 'Continuar',
      customClass: {
        confirmButton: 'swal-button--confirm',
      },
    });
    this.router.navigate(['/inicio']);
  }
}
