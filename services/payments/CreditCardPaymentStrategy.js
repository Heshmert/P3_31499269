// services/payments/CreditCardPaymentStrategy.js

class CreditCardPaymentStrategy {
  async processPayment(paymentDetails, amount) {
    const payload = {
      method: 'CreditCard',
      amount,
      currency: paymentDetails.currency,
      cardToken: paymentDetails.cardToken
    };

    const res = await fetch('https://fakepayment.onrender.com/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.status === 'approved') {
      return { success: true, transactionId: data.transactionId || data.id };
    }
    return { success: false, error: data?.error || data?.message || 'Payment rejected' };
  }
}

module.exports = CreditCardPaymentStrategy;
