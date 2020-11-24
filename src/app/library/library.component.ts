import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Login } from '../auth/login.model';
import { Library } from './library.model';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit, OnDestroy {
    libraries: any[] = [];
    isAdmin = false;
    showEdit = false;

    constructor(private authService: AuthService, private http: HttpClient, private route: ActivatedRoute, private router: Router) {


        
    }
    ngOnDestroy() {
        this.libraries = [];
    }


    ngOnInit() {
        const userData: {
            username: string;
            _token: string;
            _tokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem('userData')!);

        console.log("Stored token is: " + userData._token);

        if (userData) {
            let text: boolean;
            var header = {
                headers: new HttpHeaders()
                  .set('Authorization',  `Bearer ` + userData._token)
              }
            this.http.get<boolean>(
                'http://localhost:9001/api/user/role/' + userData.username,
                header
            ).subscribe(data => {
                this.isAdmin = data;
            })

            this.http.get<Library>(
                'http://localhost:9001/api/library',
                header
            ).subscribe(data => {
                this.libraries.push(data);
            })
        }
       
          
    }


    onEdit() {
        this.showEdit = !this.showEdit;
        //this.router.navigate(['edit'], {relativeTo: this.route, state: {isAdmin: this.isAdmin}});
    }




}