import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BlogsModel } from '../Model/Blogs';

export interface AuthorModel {
  name: string;
  bio: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogsService {
  private apiUrl = `${environment.url}/blogs`;
  private apiUrlAuthors = `${environment.url}/authors`;

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<AuthorModel[]> {
    return this.http.get<AuthorModel[]>(this.apiUrlAuthors);
  }

  getBlogs(): Observable<BlogsModel[]> {
    return this.http.get<BlogsModel[]>(this.apiUrl);
  }

  getBlogsById(id: number): Observable<BlogsModel> {
    return this.http.get<BlogsModel>(`${this.apiUrl}/${id}`);
  }

  addBlogs(blogs: BlogsModel): Observable<BlogsModel> {
    return this.http.post<BlogsModel>(this.apiUrl, blogs);
  }

  updateBlogs(id: number, blog: BlogsModel): Observable<BlogsModel> {
    return this.http.put<BlogsModel>(`${this.apiUrl}/${id}`, blog);
  }
}
