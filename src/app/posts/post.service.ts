import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postUpdates = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

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
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postUpdates.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdates;
  }

  addPost(title: string, content: string, file: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append('content', content);
    postData.append('thumbnail', file, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/posts',
        postData
      )
      .subscribe((res) => {
        const post: Post = {
          id: res.post.id,
          title,
          content,
          imagePath: res.post.imagePath
        };
        this.posts.push(post);
        this.postUpdates.next([...this.posts]);
        this.redirectToHome();
      });
  }

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>(`http://localhost:3000/posts/${postId}`)
      .subscribe((res) => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postUpdates.next([...this.posts]);
      });
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      `http://localhost:3000/posts/${postId}`
    );
  }

  updatePost(postId: string, title: string, content: string, image: File | string) {
    let post: Post | FormData;
    if (typeof(image) === "object") {
      post = new FormData();
      post.append("id", postId);
      post.append("title", title);
      post.append('content', content);
      post.append('thumbnail', image, title);

    } else {
      post = {
        id: postId,
        title: title,
        content: content,
        thumbnail: image
      };
    }

    this.http
      .put<{ message: string }>(`http://localhost:3000/posts/${postId}`, post)
      .subscribe((res) => {
        console.log(res);
        this.redirectToHome();
      });
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }
}
