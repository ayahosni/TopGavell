import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router'; 
import { PaymentService } from '../../services/payment.service';
@Component({
  selector: 'app-payment-verification',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './payment-verification.component.html',
  styleUrl: './payment-verification.component.css'
})
export class PaymentVerificationComponent {
  constructor (
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ){}
  auctionId: any ;
  ngOnInit(): void {
    this.auctionId = localStorage.getItem('auctionIdToBidOn');
  }
  procced(){
  this.paymentService.checkout(this.auctionId).subscribe({
  })
  }
}
