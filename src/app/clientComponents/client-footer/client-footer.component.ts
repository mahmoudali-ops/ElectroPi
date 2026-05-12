import { Component } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-footer',
  standalone: true,
  imports: [TranslatedPipe, RouterLink],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.css'
})
export class ClientFooterComponent {}
