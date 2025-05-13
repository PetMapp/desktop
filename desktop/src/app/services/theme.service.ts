import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'theme'; // Chave para armazenar o tema no localStorage

  constructor() {
    this.setTheme(this.getStoredTheme()); // Ao inicializar, define o tema salvo
  }

  setTheme(theme: 'light' | 'dark') {
    this.applyTheme(theme);
    localStorage.setItem(this.themeKey, theme); // Armazena o tema no localStorage
  }

  getTheme(): 'light' | 'dark' {
    return this.getStoredTheme(); // Retorna o tema armazenado no localStorage
  }

  private getStoredTheme(): 'light' | 'dark' {
    // Recupera o tema salvo no localStorage ou usa a preferência do sistema como fallback
    const storedTheme = localStorage.getItem(this.themeKey);
    if (storedTheme) {
      return storedTheme as 'light' | 'dark';
    }
    return this.detectTheme(); // Caso não tenha um valor no localStorage, detecta o sistema
  }

  private detectTheme(): 'light' | 'dark' {
    // Detecta a preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: 'light' | 'dark') {
    // Aplica o tema ao body
    document.body.setAttribute('color-theme', theme);
  }
}
