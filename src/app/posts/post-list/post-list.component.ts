import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 0;
  pageSizeOptions = [1,2,5,10]

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts(this.postPerPage, this.currentPage);

    this.isLoading = true;
    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((postData) => {
        console.log(postData);
        this.posts = postData.posts;
        this.totalPosts = postData.count;
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
