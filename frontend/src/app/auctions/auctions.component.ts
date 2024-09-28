import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [],
  templateUrl: './auctions.component.html',
  styleUrl: './auctions.component.css'
})
export class AuctionsComponent {
  users: any;

  constructor(private UserServ: AuthService) { }
  ngOnInit(): void {
    this.UserServ.getAllData().subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }
}
