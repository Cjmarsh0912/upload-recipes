export interface RecipeData {
  id: string;
  recipe_name: string;
  keywords: string[];
  extension: string;
  categories: string[];
  category_extension: string;

  rating: number;
  comments: CommentInterface[];
  description: string;
  date_posted: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  image: string;
  ingredients: string[];
  steps: {
    header: string;
    step: string;
  }[];
}

export interface CommentInterface {
  comment_id: string;
  user_uid: string;
  name: string;
  date: string;
  comment: string;
  rating: number;
  likes: string[];
  replies: ReplyInterface[];
}

export interface ReplyInterface {
  reply_id: string;
  user_uid: string;
  name: string;
  date: string;
  comment: string;
  likes: string[];
}
