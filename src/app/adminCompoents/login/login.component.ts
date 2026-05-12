import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgClass, RouterLink, TranslatedPipe]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  IsSccuess = false;
  serverError = '';
  returnUrl = '/store';

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly toasterService = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    const qp = this._route.snapshot.queryParams['returnUrl'] as string | undefined;
    const isAdminLogin = this._router.url.includes('/admin/login');
    this.returnUrl = qp || (isAdminLogin ? '/admin/dashboard' : '/store');
  }

  private persistSession(res: unknown): void {
    localStorage.setItem('isLoggedIn', 'true');
    let role = 'Customer';
    let userId = '';
    if (res && typeof res === 'object') {
      const r = res as Record<string, unknown>;
      const user = (r['user'] ?? r['User']) as Record<string, unknown> | undefined;
      userId = String(r['userId'] ?? r['UserId'] ?? user?.['id'] ?? user?.['Id'] ?? '');
      const roles = (r['roles'] ?? r['Roles'] ?? user?.['roles']) as unknown;
      if (Array.isArray(roles) && roles.some((x) => String(x).toLowerCase().includes('admin'))) {
        role = 'Admin';
      }
      const single = r['role'] ?? r['Role'];
      if (typeof single === 'string' && single.toLowerCase().includes('admin')) {
        role = 'Admin';
      }
    }
    localStorage.setItem('userRole', role);
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;

    this.authService.Login(loginData).subscribe({
      next: (res: unknown) => {
        this.IsSccuess = true;
        this.toasterService.success('Login valid!', 'Success');
        this.persistSession(res);

        const role = localStorage.getItem('userRole');
        if (role === 'Admin') {
          const dest = this.returnUrl.startsWith('/admin') ? this.returnUrl : '/admin/dashboard';
          this._router.navigateByUrl(dest);
        } else {
          const dest =
            this.returnUrl && !this.returnUrl.startsWith('/admin') ? this.returnUrl : '/store';
          this._router.navigateByUrl(dest);
        }
      },
      error: () => {
        this.toasterService.error('Invalid email or password', 'Login Failed');
      }
    });
  }
}
