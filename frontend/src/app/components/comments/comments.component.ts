import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})



export class CommentsComponent implements OnInit{

  comment_text = 'I want to buy this item';
  auctionID:number;

  constructor(private comserv : CommentsService, myRoute:ActivatedRoute){ 
    this.auctionID =  myRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
  this.comserv.addComment(this.comment_text,this.auctionID).subscribe({
    next: (data) => {
      console.log(data);
    },
    error: (error) => {
      console.error(error);
    }
  });
}}