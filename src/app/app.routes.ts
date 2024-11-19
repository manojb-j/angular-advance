import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { BlogsListComponent } from './components/blogs-list/blogs-list.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { DiscoverPageComponent } from './components/discover-page/discover-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'blogsList',
    component: BlogsListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'blogView/:id',
    component: BlogViewComponent,
    canActivate: [authGuard],
  },
  { path: 'discover', component: DiscoverPageComponent },
];
