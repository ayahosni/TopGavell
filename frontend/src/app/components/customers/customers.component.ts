import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  standalone:true,
  imports:[CommonModule]
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadCustomers(this.currentPage);
  }

  loadCustomers(page: number): void {
    this.userService.getCustomers(page).subscribe(response => {
      this.customers = response.data;
      this.currentPage = response.meta.current_page;
      this.lastPage = response.meta.last_page;
      this.total = response.meta.total;
    });
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.lastPage) {
      this.loadCustomers(page);
    }
  }
}
