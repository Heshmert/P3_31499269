class CreditCardPaymentStrategy {
  async processPayment(paymentDetails, amount) {
    // Construir el payload EXACTO que la API espera
    const payload = {
      amount: String(amount), // la API espera string
      "card-number": paymentDetails.cardNumber,
      cvv: paymentDetails.cvv,
      "expiration-month": paymentDetails.expirationMonth,
      "expiration-year": paymentDetails.expirationYear,
      "full-name": paymentDetails.fullName, // APROBADO, RECHAZADO, ERROR, INSUFICIENTE
      currency: paymentDetails.currency,
      description: paymentDetails.description || "Pago en tienda",
      reference: paymentDetails.reference || `order:${Date.now()}`
    };

    // Llamada al endpoint con autenticación
    const res = await fetch('https://fakepayment.onrender.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FAKEPAYMENT_API_KEY}` // tu API key en .env
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    // Interpretar la respuesta según la documentación
    if (res.ok && payload["full-name"] === "APROBADO") {
      return { success: true, transactionId: data.transactionId || data.id };
    }

    // Mapear errores según el "full-name"
    let errorMessage = "Payment rejected";
    if (payload["full-name"] === "RECHAZADO") errorMessage = "Pago rechazado";
    if (payload["full-name"] === "ERROR") errorMessage = "Error en el pago";
    if (payload["full-name"] === "INSUFICIENTE") errorMessage = "Fondos insuficientes";

    return { success: false, error: errorMessage };
  }
}

module.exports = CreditCardPaymentStrategy;
