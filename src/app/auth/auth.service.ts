import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(public http: HttpClient) { }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post("http://localhost:3000/user/signup", authData).subscribe((response) => {
      console.log(response);
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post<{token: string}>("http://localhost:3000/user/login", authData).subscribe((response) => {
      this.token = response.token;
      this.authStatusListener.next(true);
    })
  }

  getToken() {
    return this.token;
  }

  getAutStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout() {
    this.authStatusListener.next(false);
  }
}
