import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Login } from './login.model';

export interface AuthResponseData {
  token: string;
  username: string;
  expiresIn: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<Login | null>(null);
  LOGIN_AUTH_URL = 'http://localhost:9001/api/auth/signin';
  private tokenExpirationTimer: any;

  constructor(private http:HttpClient, private router: Router) {}

  login(username: string, password: string) {
      return this.http
          .post<AuthResponseData>(
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
                          resData.token,
                          +resData.expiresIn
                      );
                  }
              )
          );
  }

  private handleAuthentication(
      username: string,
      token: string,
      expiresIn: number
    ) {
      const expirationDate = new Date(new Date().getTime() + expiresIn);
      const user = new Login(username, token, expirationDate);
      this.user.next(user);
      this.autoLogout(expiresIn);
      localStorage.setItem('userData', JSON.stringify(user));
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
    const userData: {
      username: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!);

    console.log("in auto login");
    console.log(userData);

    if (!userData) {
      return;
    }

    const loadedUser = new Login(
      userData.username,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }


  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
}