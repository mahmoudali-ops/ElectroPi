import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../../core/services/language.service';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { TranslationService } from '../../core/services/translation.service';
import { CartService } from '../../core/services/cart-service.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatedPipe, CommonModule],
  templateUrl: './client-nav.component.html',
  styleUrl: './client-nav.component.css'
})
export class ClientNavComponent implements OnInit {
  private readonly langService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastrService);

  isBrowser = typeof window !== 'undefined';
  isScrolled = false;
  isOffcanvasOpen = false;
  activeDropdown: string | null = null;

  readonly cartCount = signal(0);
  readonly isAuthRoute = signal(false);
  readonly isLoggedIn = signal(false);

  ngOnInit(): void {
    this.translationService.setLang(this.langService.currentLangValue);
    this.onWindowScroll();
    this.syncRoute();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.syncRoute();
      this.loadCartCount();
    });

    this.cart.cartCount$.subscribe({ next: (count) => this.cartCount.set(count) });
    this.loadCartCount();
  }

  private syncRoute(): void {
    if (!this.isBrowser) return;
    const path = this.router.url.split('?')[0];
    const normalized = path.toLowerCase();
    this.isAuthRoute.set(normalized.endsWith('/login') || normalized.endsWith('/register'));
    this.isLoggedIn.set(localStorage.getItem('isLoggedIn') === 'true');
  }

  private loadCartCount(): void {
    if (!this.isBrowser) return;
    const uid = localStorage.getItem('userId');
    if (!uid || localStorage.getItem('userRole') === 'Admin') {
      this.cartCount.set(0);
      return;
    }
    this.cart.refreshCartCount();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollPosition > 50;
  }

  toggleOffcanvas(): void {
    this.isOffcanvasOpen = !this.isOffcanvasOpen;
    if (this.isOffcanvasOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      this.resetBody();
      this.activeDropdown = null;
    }
  }

  closeOffcanvas(): void {
    this.isOffcanvasOpen = false;
    this.resetBody();
    this.activeDropdown = null;
  }

  private resetBody(): void {
    document.documentElement.style.overflow = '';
  }

  toggleDropdown(event: Event, dropdownName: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === dropdownName ? null : dropdownName;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOffcanvasOpen) {
      this.closeOffcanvas();
    }
  }

  changeLang(lang: 'en' | 'ar'): void {
    this.langService.setLanguage(lang);
    this.translationService.setLang(lang);
  }

  logout(): void {
    if (!this.isBrowser) {
      this.router.navigate(['/login']);
      return;
    }
    this.auth.LogOut().subscribe({
      next: () => {
        this.toast.success('Logged out');
        this.cartCount.set(0);
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
      }
    });
  }
}
