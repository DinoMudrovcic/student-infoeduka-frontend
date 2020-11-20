import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Login } from './login.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    login = new BehaviorSubject<Login | null>(null);
    LOGIN_AUTH_URL = 'http://localhost:9001/api/auth/signin'

    constructor(private http:HttpClient, private router: Router) {}

    _login(username: string, password: string) {
        return this.http
            .post<Login>(
                this.LOGIN_AUTH_URL,
                {
                    "username": username,
                    "password": password
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(
                    resData => {
                        this.handleAuthentication(
                            resData.username,
                            resData.token
                        );
                    }
                )
            );
    }

    _logout() {
        this.login.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('loginData');
      }

    private handleAuthentication(
        username: string,
        token: string,
      ) {
        const login = new Login(username, token);
        this.login.next(login);
        localStorage.setItem('loginData', JSON.stringify(login));
      }
    
    private handleError(errorRes: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMessage);
      }
      switch (errorRes.error.error.message) {
        case 'USERNAME_NOT_FOUND':
          errorMessage = 'Invalid credentials.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'Invalid credentials.';
          break;
      }
      return throwError(errorMessage);
    }


    autoLogin() {
      const loginData: {
        username: string,
        token: string
      } = JSON.parse(localStorage.getItem('loginData') || '{}');
      if (!loginData) {
        return;
      }
  
      const loadedUser = new Login(
        loginData.username,
        loginData.token
      );
  
      if (loadedUser.token) {
        this.login.next(loadedUser);
      }
    }
}