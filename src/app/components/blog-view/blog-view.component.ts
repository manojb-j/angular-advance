import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BlogsModel, CommentModel } from '../../Model/Blogs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogsService } from '../../services/blogs.service';

@Component({
  selector: 'app-blog-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-view.component.html',
  styleUrl: './blog-view.component.css',
})
export class BlogViewComponent implements OnInit {
  blogId: number | null = null;
  blogDetails: BlogsModel | null = null;
  blogsList: BlogsModel[] = [];
  blogService = inject(BlogsService);
  router = inject(Router);

  commentUser: string = '';
  commentText: string = '';
  replyText: string = '';
  name: string = '';

  constructor(
    private route: ActivatedRoute,
    private blogsService: BlogsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.name = user.name;
    } else {
      console.error('No logged-in user found in sessionStorage');
    }

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.blogId = +idParam;
        this.loadBlogDetails(this.blogId);
        console.log('ID parameter:', idParam);
      } else {
        console.error('No ID parameter found');
      }
    });

    this.loadBlogs();
  }

  getDetails(id?: number): void {
    this.router.navigate(['/blogView', id?.toString()]);
  }

  loadBlogs() {
    this.blogsService.getBlogs().subscribe((data) => {
      this.blogsList = data;
    });
  }

  loadBlogDetails(id: number): void {
    this.blogsService.getBlogsById(id).subscribe(
      (blog) => {
        this.blogDetails = blog;

        this.blogDetails.comments?.forEach((comment) => {
          comment.likes = comment.likes || 0;
          comment.replies?.forEach((reply) => {
            reply.likes = reply.likes || 0;
          });
        });
        console.log('Blog details loaded:', this.blogDetails);
      },
      (error) => {
        console.error('failed to load the blog details', error);
      }
    );
  }

  addComment(): void {
    if (this.commentText.trim()) {
      const newComment: CommentModel = {
        user: this.name,
        text: this.commentText,
        date: new Date().toLocaleString(),
        likes: 0,
        replies: [],
        showReplyInput: false,
      };

      if (this.blogDetails) {
        this.blogDetails.comments = this.blogDetails.comments || [];
        this.blogDetails.comments.push(newComment);

        this.updateBlogDetails();
        this.commentText = '';
      }
    }
  }

  toggleReplyInput(comment: CommentModel): void {
    comment.showReplyInput = !comment.showReplyInput;
  }

  addReply(comment: CommentModel): void {
    if (this.replyText) {
      const newReply: CommentModel = {
        user: this.name,
        text: this.replyText,
        date: new Date().toLocaleString(),
        likes: 0,
      };

      comment.replies = comment.replies || [];
      comment.replies.push(newReply);

      this.updateBlogDetails();
      this.replyText = '';
      comment.showReplyInput = false;
    }
  }

  updateBlogDetails(): void {
    console.log('Updating blog details with comments:', this.blogDetails);
    if (this.blogDetails) {
      this.blogsService.updateBlogs(this.blogId!, this.blogDetails).subscribe(
        () => {
          console.log('Blog updated with new comment/reply');
        },
        (error) => {
          console.error('Failed to update blog details', error);
        }
      );
    }
  }

  sortComments(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const criteria = target.value;

    if (this.blogDetails?.comments) {
      let sortedComments;
      switch (criteria) {
        case 'newest':
          sortedComments = [...this.blogDetails.comments].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          break;
        case 'oldest':
          sortedComments = [...this.blogDetails.comments].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          break;
        case 'mostLiked':
          sortedComments = [...this.blogDetails.comments].sort(
            (a, b) => b.likes - a.likes
          );
          break;
      }

      // Update the comments with the sorted array
      this.blogDetails.comments = sortedComments;

      // Manually trigger change detection
      this.cdRef.detectChanges();
    }
  }

  likeComment(comment: CommentModel): void {
    const userId = this.name;
    if (!comment.likedBy) {
      comment.likedBy = [];
    }

    if (comment.likedBy.includes(userId)) {
      comment.likes -= 1;
      comment.likedBy = comment.likedBy.filter((id) => id !== userId);
    } else {
      comment.likes += 1;
      comment.likedBy.push(userId);
    }

    this.updateBlogDetails();
  }
  likeReply(reply: CommentModel): void {
    const userId = this.name;

    if (!reply.likedBy) {
      reply.likedBy = [];
    }

    if (reply.likedBy.includes(userId)) {
      reply.likes -= 1;
      reply.likedBy = reply.likedBy.filter((id) => id !== userId);
    } else {
      reply.likes += 1;
      reply.likedBy.push(userId);
    }

    this.updateBlogDetails();
  }
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
