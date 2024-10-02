import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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


  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
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

  submitComment(): void {
    if (this.newComment.comment_text.trim() !== '') {
      this.commentsService.createComment(this.auctionId, this.newComment).subscribe({
        next: (response: any) => {
          this.comments.push(response.comment);
          this.newComment.comment_text = '';
        },
        error: (error: any) => {
          console.error('Error submitting comment:', error);
        }
      });
    } else {
      alert('Comment content cannot be empty.');
    }
  }

  deleteComment(commentId: string) {
    this.commentsService.deleteComment(this.auctionId, commentId).subscribe({
      next: (response) => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        console.log('Comment deleted:', response);
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
      }
    });
  }
}
