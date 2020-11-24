import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-library-edit',
    templateUrl: './library-edit.component.html'
})
export class LibraryEditComponent {


    constructor(
        private route: ActivatedRoute,
        private router: Router
      ) {
         
      }


      
    

}