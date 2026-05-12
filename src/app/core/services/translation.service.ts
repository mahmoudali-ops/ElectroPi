import { Injectable, inject, computed } from '@angular/core';
import { LanguageService } from './language.service';
import { EN } from '../../../assets/i18n/en';
import { AR } from '../../../assets/i18n/ar';

function readPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj as unknown);
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly language = inject(LanguageService);

  /** Mirrors the active language signal for the translate pipe. */
  readonly lang = this.language.lang;

  readonly direction = computed(() => (this.language.lang() === 'ar' ? 'rtl' : 'ltr'));

  setLang(lang: 'en' | 'ar'): void {
    this.language.setLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  }

  t(key: string): string {
    const lang = this.language.lang();
    const primary = readPath((lang === 'ar' ? AR : EN) as Record<string, unknown>, key);
    if (typeof primary === 'string') return primary;
    const fallback = readPath(EN as Record<string, unknown>, key);
    return typeof fallback === 'string' ? fallback : key;
  }
}
