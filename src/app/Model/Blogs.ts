export interface BlogsModel {
  id?: number;
  title: string;
  image: string;
  date: string;
  auther: string;
  discription: string;
  comments?: CommentModel[];
  status: 'published' | 'draft' | 'scheduled';
  scheduledDate?: string;
}

export interface CommentModel {
  user: string;
  text: string;
  date: string;
  replies?: CommentModel[];
  likes: number;
  likedBy?: string[];
  showReplyInput?: boolean;
}
