import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { LibraryEditComponent } from './library/library-edit/library-edit.component';
import { LibraryComponent } from './library/library.component';

const routes: Routes = [
  { path: '', redirectTo: '/library', pathMatch: 'full'},
  {
    path: 'library',
    component: LibraryComponent,
    canActivate: [AuthGuard]
  },
 
  
  {
    path: 'auth',
    component: AuthComponent
  },

  { path: '**', redirectTo: '/library', pathMatch: 'full'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
