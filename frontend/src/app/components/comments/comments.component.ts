import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comments',
  standalone: true, 
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: any[] = [];  
  newComment: string = '';  
  auctionId: string = '1';  
  
  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.commentsService.getCommentsByAuctionId(this.auctionId).subscribe({
      next: (response) => {
        this.comments = response.comments; 
        console.log('Comments loaded:', this.comments);
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      },
      complete: () => {
        console.log('Completed loading comments.');
      }
    });
  }

  addComment() {
    if (this.newComment.trim() === '') {
      console.log('Comment is empty.');
      return;
    }

    const commentData = { text: this.newComment };

    this.commentsService.createComment(this.auctionId, commentData).subscribe({
      next: (response) => {
        this.comments.push(response.comment); 
        this.newComment = ''; 
        console.log('Comment added:', response.comment);
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      },
      complete: () => {
        console.log('Completed adding comment.');
      }
    });
  }

  updateComment(commentId: string, updatedText: string) {
    const commentData = { text: updatedText };

    this.commentsService.updateComment(this.auctionId, commentId, commentData).subscribe({
      next: (response) => {
        const commentIndex = this.comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          this.comments[commentIndex].text = updatedText; 
        }
        console.log('Comment updated:', response);
      },
      error: (error) => {
        console.error('Error updating comment:', error);
      },
      complete: () => {
        console.log('Completed updating comment.');
      }
    });
  }

  deleteComment(commentId: string) {
    this.commentsService.deleteComment(this.auctionId, commentId).subscribe({
      next: (response) => {
        this.comments = this.comments.filter(comment => comment.id !== commentId); 
        console.log('Comment deleted:', response);
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
      },
      complete: () => {
        console.log('Completed deleting comment.');
      }
    });
  }
}