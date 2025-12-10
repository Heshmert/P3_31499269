// services/payments/PaymentStrategy.js
class PaymentStrategy {
  // processPayment debe devolver un objeto con { success: boolean, transactionId?: string, error?: string }
  async processPayment(paymentDetails, amount) {
    throw new Error('processPayment must be implemented by concrete strategies');
  }
}

module.exports = PaymentStrategy;
