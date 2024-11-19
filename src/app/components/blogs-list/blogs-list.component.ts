import { Component, inject, OnInit } from '@angular/core';
import { BlogsModel } from '../../Model/Blogs';
import { BlogsService } from '../../services/blogs.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './blogs-list.component.html',
  styleUrl: './blogs-list.component.css',
})
export class BlogsListComponent implements OnInit {
  blogsList: BlogsModel[] = [];
  searchTerm: string = '';
  filterdBlogs: BlogsModel[] = [];
  blogsService = inject(BlogsService);
  router = inject(Router);
  activeSort: string = '';

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogsService.getBlogs().subscribe((data) => {
      this.blogsList = data;
      this.filterdBlogs = data;
    });
  }
  getDetails(id?: number): void {
    this.router.navigate(['/blogView', id?.toString()]);
  }

  addPost() {
    this.router.navigate(['home']);
  }

  onSearch() {
    this.filterdBlogs = this.blogsList.filter((item) => {
      const matchsSearch = item.title
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchsAuther = item.auther
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());

      return matchsAuther || matchsSearch;
    });
  }

  sortBlogs(criteria: string) {
    this.activeSort = criteria;
    if (criteria === 'mostCmt') {
      this.filterdBlogs = [...this.filterdBlogs].sort(
        (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
      );
    } else if (criteria === 'newest') {
      this.filterdBlogs = [...this.filterdBlogs].sort(
        (a, b) =>
          new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
      );
    } else if (criteria === 'oldest') {
      this.filterdBlogs = [...this.filterdBlogs].sort(
        (a, b) =>
          new Date(a.date || '').getTime() - new Date(b.date || '').getTime()
      );
    }
  }

  currentPage = 1;
  itemsPerPage = 4;
  get paginatedBlogsList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filterdBlogs.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filterdBlogs.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
