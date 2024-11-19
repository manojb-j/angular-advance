import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { BlogsModel } from '../../Model/Blogs';
import { BlogsService } from '../../services/blogs.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EditorModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user: any;

  blog: BlogsModel = {
    title: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    auther: JSON.parse(sessionStorage.getItem('loggedInUser')!).name,
    discription: '',
    status: 'draft',
  };
  auth = inject(AuthService);
  BlogService = inject(BlogsService);
  router = inject(Router);

  constructor(private authStateService: AuthStateService) {}

  ngOnInit(): void {
    this.authStateService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  handleEditorChange(content: string) {
    this.blog.discription = content;
  }

  submitBlog() {
    this.blog.status = 'published';
    this.BlogService.addBlogs(this.blog).subscribe((response) => {
      console.log('Blog added:', response);
      this.router.navigate(['blogsList']);
    });
  }

  saveAsDraft() {
    this.blog.status = 'draft';

    this.BlogService.addBlogs(this.blog).subscribe((response) => {
      console.log('Blog saved as draft:', response);
      this.router.navigate(['draftsList']);
    });
  }

  signOut() {
    sessionStorage.clear();
    this.auth.signOut();
  }
}
