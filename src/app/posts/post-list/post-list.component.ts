import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postSubscription: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts();

    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((posts) => (this.posts = posts));
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
