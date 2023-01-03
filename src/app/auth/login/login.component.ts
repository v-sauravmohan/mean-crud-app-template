import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authStatusSubs: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSubs = this.authService.getAutStatusListener().subscribe(isAuth => {
      if (!isAuth) {
        this.isLoading = false;
      }
    });
  }

  onLogin(form) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }
}
