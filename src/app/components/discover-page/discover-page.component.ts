import { Component, inject, OnInit } from '@angular/core';
import { BlogsModel } from '../../Model/Blogs';
import { AuthorModel, BlogsService } from '../../services/blogs.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discover-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './discover-page.component.html',
  styleUrl: './discover-page.component.css',
})
export class DiscoverPageComponent implements OnInit {
  blogsList: BlogsModel[] = [];
  authorsList: AuthorModel[] = [];
  searchTerm: string = '';
  filterdBlogs: BlogsModel[] = [];
  filterAuthor: AuthorModel[] = [];
  blogsService = inject(BlogsService);
  router = inject(Router);

  ngOnInit(): void {
    this.loadBlogs();
    this.loadAuthors();
  }

  loadBlogs() {
    this.blogsService.getBlogs().subscribe((data) => {
      this.blogsList = data;
      this.filterdBlogs = data;
    });
  }

  loadAuthors() {
    this.blogsService.getAuthors().subscribe((data) => {
      this.authorsList = data;
      this.filterAuthor = data;
    });
  }

  getDetails(id?: number): void {
    this.router.navigate(['/blogView', id?.toString()]);
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
    this.filterAuthor = this.authorsList.filter((item) => {
      const authorSearch = item.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return authorSearch;
    });
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
