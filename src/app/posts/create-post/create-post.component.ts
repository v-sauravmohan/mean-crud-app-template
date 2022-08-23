import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {

  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  onAddPost(form: NgForm) {
    if (form.valid) {
      this.postService.addPost(form.value.title, form.value.content);
      form.resetForm();
    }
  }
}
