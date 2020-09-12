import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

constructor(
       public postService: PostsService,
       public authService: AuthService
       ) {}

posts: Post[] = [];
isLoading = false;
private postsSub: Subscription;
private authSatusSub: Subscription;
public userIsAuthenticated = false;

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authSatusSub = this.authService
         .getAuthStatusListeber()
          .subscribe(isAuthenticated => {
             this.userIsAuthenticated = isAuthenticated;
          });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSatusSub.unsubscribe();
  }
  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
