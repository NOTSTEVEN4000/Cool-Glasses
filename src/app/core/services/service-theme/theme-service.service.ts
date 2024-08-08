import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {
  private renderer: Renderer2;
  private mode: string = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();
  }

  setMode(mode: string) {
    this.mode = mode;
    this.updateBodyClass();
    localStorage.setItem('theme', mode);
  }

  getMode(): string {
    return this.mode;
  }

  private loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.mode = storedTheme;
      this.updateBodyClass();
    }
  }

  private updateBodyClass() {
    if (this.mode === 'dark') {
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }
  }

  clearTheme() {
    this.mode = 'light';
    this.updateBodyClass();
    localStorage.removeItem('theme');
  }
}