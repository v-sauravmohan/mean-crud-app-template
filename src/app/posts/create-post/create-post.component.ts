import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { mimeType } from '../mime-type.validator';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private postId = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  thumbnailPreview: string;
  authStatusSub: Subscription;

  constructor(private postService: PostService, public route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      thumbnail: new FormControl(null, Validators.required, mimeType),
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.mode = 'edit';
        this.postId = params.get('id');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((res) => {
          this.post = {
            id: res._id,
            title: res.title,
            content: res.content,
            imagePath: res.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            thumbnail: this.post.imagePath,
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });

    this.authStatusSub = this.authService.getAutStatusListener().subscribe(isAuth => this.isLoading = false);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode == 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.thumbnail
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.thumbnail
      );
    }
    this.form.reset();
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ thumbnail: file });
    this.form.get('thumbnail').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
