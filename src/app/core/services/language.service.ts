import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { signal, Signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private platformId = inject(PLATFORM_ID);

  // signal لحفظ اللغة الحالية
  public lang = signal<'en' | 'ar'>('en');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') as 'en' | 'ar' | null;
      if (savedLang === 'en' || savedLang === 'ar') this.lang.set(savedLang);
    }
  }

  setLanguage(lang: 'en' | 'ar') {
    this.lang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }

  // signal للغة الحالية
  get currentLang(): Signal<'en' | 'ar'> {
    return this.lang;
  }

  get currentLangValue(): 'en' | 'ar' {
    return this.lang();
  }
}
