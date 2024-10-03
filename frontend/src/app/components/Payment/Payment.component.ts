import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../environments/environment';

declare var Stripe: any;

@Component({
  selector: 'app-payment',
  templateUrl: './Payment.component.html',
  styleUrls: ['./Payment.component.css']
})
export class PaymentComponent {
  private stripe: any;

  constructor(private paymentService: PaymentService) {
    // this.stripe = new Stripe(environment.stripeKey);
    this.stripe = (window as any).Stripe(environment.stripeKey);
  }

  pay() {
    const auctionId = '3';
    this.paymentService.createCheckoutSession(auctionId).subscribe((response) => {
      this.stripe.redirectToCheckout({ sessionId: response.id }).then((result: any) => {
        if (result.error) {
          // Display error.message in your UI.
          console.log(result.error.message);
        }
      });
    });
  }
}
