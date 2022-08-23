import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postUpdates = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((posts) => {
        console.log(posts);
        this.posts = posts;
        this.postUpdates.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdates;
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: '',
      title,
      content,
    };
    this.http
      .post<{ message: string }>('http://localhost:3000/posts', post)
      .subscribe((res) => {
        this.posts.push(post);
        this.postUpdates.next([...this.posts]);
      });
  }

  deletePost(postId: string){
    this.http.delete<{message: string}>(`http://localhost:3000/posts/${postId}`).subscribe((res) => {
      console.log(res.message);
    })
  }
}
