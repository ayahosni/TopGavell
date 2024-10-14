import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() auctionId: string = ''; 
  comments: any[] = [];
  newComment = { comment_text: '' };
  editMode: boolean = false;
  currentCommentId: string | null = null;
  isBanned: boolean = false;

  constructor(private commentsService: CommentsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isBanned = this.authService.isUserBanned();  //customer one -> isbanned = true

    if (this.auctionId) { 
      this.loadComments();
    } else {
      console.error('Auction ID is not provided.');
    }
  }

  loadComments() {
    this.commentsService.getCommentsByAuctionId(this.auctionId).subscribe({
      next: (response) => {
        this.comments = response.comments;
        console.log('Comments loaded:', this.comments);
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      }
    });
  }

  submitComment(): void {             //customer one -> isbanned = true
    if (this.isBanned) {                 
      console.warn('You cannot submit comments because you are banned.');
      return;
    }

    if (this.newComment.comment_text.trim() !== '') {
      if (this.editMode) {
        this.commentsService.updateComment(this.auctionId, this.currentCommentId!, { comment_text: this.newComment.comment_text }).subscribe({
          next: (response) => {
            const index = this.comments.findIndex(comment => comment.comment_id === this.currentCommentId);
            if (index !== -1) {
              this.comments[index] = response.comment;
            }
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating comment:', error);
          }
        });
      } else {
        this.commentsService.createComment(this.auctionId, this.newComment).subscribe({
          next: (response) => {
            this.comments.push(response.comment);
            this.resetForm();
          },
          error: (error) => {
            console.error('Error submitting comment:', error);
          }
        });
      }
    } else {
      console.warn('Comment content cannot be empty.');
    }
  }

  editComment(comment: any) {
    this.newComment.comment_text = comment.content; 
    this.currentCommentId = comment.comment_id; 
    this.editMode = true; 
  }

  deleteComment(commentId: string) {
    this.commentsService.deleteComment(this.auctionId, commentId).subscribe({
      next: (response) => {
        this.comments = this.comments.filter(comment => comment.comment_id !== commentId);
        console.log('Comment deleted:', response);
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
      }
    });
  }
  
  resetForm() {
    this.newComment.comment_text = '';
    this.editMode = false;
    this.currentCommentId = null; 
  }
}
