import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl:'./auth.component.html'
})
export class AuthComponent {

    isLoading = false;
    error = '';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const username = form.value.username;
        const password = form.value.password;
    
        let authObs: Observable<AuthResponseData>;
    
        this.isLoading = true;
    
       authObs = this.authService.login(username, password);
        
      
        authObs.subscribe(
            resData => {
                this.isLoading = false;
                this.router.navigate(['/library']);
            },
            errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
            }
        );
    
        form.reset();
        
    }

}