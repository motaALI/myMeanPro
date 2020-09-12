import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable(
  {providedIn: 'root'}
)

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any; // stock the time
  private authStatusListeber = new Subject<boolean>();

  getToken() {
    return this.token;
  }

  getAuthStatusListeber() {
    return this.authStatusListeber.asObservable();
  }
  getIsAuth() {
   return this.isAuthenticated;
  }
   constructor(private http: HttpClient, private router: Router) {}

   createUser(email: string, password: string) {
     const authData: AuthData = {email: email, password: password };
     this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
          console.log(response);
        });
   }

   login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password };
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      console.log(response);
      const token = response.token;
      this.token = token;
        if (token) {
        const expiresInDuration = response.expiresIn;  // add expires duration
        this.tokenTimer = setTimeout(() => {
          // when time is out call logout to claire the token
          this.logout();
        }, expiresInDuration * 1000);
        console.log(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListeber.next(true);
        this.router.navigate(['/']);
      }
    });
   }

   logout() {
     this.token = null;
     this.isAuthenticated = false;
     this.authStatusListeber.next(false);
     clearTimeout(this.tokenTimer); // clear timer wherever we do logout
     this.router.navigate(['/']);
   }
}
