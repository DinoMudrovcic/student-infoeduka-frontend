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
    private userSub: Subscription = new Subscription();
    libraries: any[] = [];
    isAdmin = false;

    constructor(private authService: AuthService, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}
    ngOnDestroy() {
        this.libraries = [];
    }


    ngOnInit() {
        this.userSub = this.authService.login.subscribe(user => {
            let text: boolean;
            var header = {
                headers: new HttpHeaders()
                  .set('Authorization',  `Bearer ` + user?.token)
              }
            this.http.get<boolean>(
                'http://localhost:9001/api/user/role/' + user?.username,
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


          });

        
          this.userSub.unsubscribe();
          
    }


    onEdit() {
        this.router.navigate(['./new'], {relativeTo: this.route});
    }




}