export const StripePaymentIntentMock = {
  "id": "pi_3Lz2mNEwMOwWEJ0o1hBgGSSx",
  "object": "payment_intent",
  "amount": 190,
  "amount_capturable": 0,
  "amount_details": {
    "tip": {
    }
  },
  "amount_received": 190,
  "application": null,
  "application_fee_amount": null,
  "automatic_payment_methods": {
    "enabled": true
  },
  "canceled_at": null,
  "cancellation_reason": null,
  "capture_method": "automatic",
  "charges": {
    "object": "list",
    "data": [
      {
        "id": "ch_3Lz2mNEwMOwWEJ0o1VLsfUKa",
        "object": "charge",
        "amount": 190,
        "amount_captured": 190,
        "amount_refunded": 0,
        "application": null,
        "application_fee": null,
        "application_fee_amount": null,
        "balance_transaction": "txn_3Lz2mNEwMOwWEJ0o1rjXDAFM",
        "billing_details": {
          "address": {
            "city": null,
            "country": "UA",
            "line1": null,
            "line2": null,
            "postal_code": null,
            "state": null
          },
          "email": null,
          "name": null,
          "phone": null
        },
        "calculated_statement_descriptor": "Stripe",
        "captured": true,
        "created": 1667241147,
        "currency": "usd",
        "customer": null,
        "description": null,
        "destination": null,
        "dispute": null,
        "disputed": false,
        "failure_balance_transaction": null,
        "failure_code": null,
        "failure_message": null,
        "fraud_details": {
        },
        "invoice": null,
        "livemode": false,
        "metadata": {
        },
        "on_behalf_of": null,
        "order": null,
        "outcome": {
          "network_status": "approved_by_network",
          "reason": null,
          "risk_level": "normal",
          "risk_score": 33,
          "seller_message": "Payment complete.",
          "type": "authorized"
        },
        "paid": true,
        "payment_intent": "pi_3Lz2mNEwMOwWEJ0o1hBgGSSx",
        "payment_method": "pm_1Lz2mcEwMOwWEJ0oXyeBRuaO",
        "payment_method_details": {
          "card": {
            "brand": "visa",
            "checks": {
              "address_line1_check": null,
              "address_postal_code_check": null,
              "cvc_check": "pass"
            },
            "country": "US",
            "exp_month": 4,
            "exp_year": 2024,
            "fingerprint": "B7XSZfAvbKhvx6je",
            "funding": "credit",
            "installments": null,
            "last4": "4242",
            "mandate": null,
            "network": "visa",
            "three_d_secure": null,
            "wallet": null
          },
          "type": "card"
        },
        "receipt_email": null,
        "receipt_number": null,
        "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTHduQjNFd01Pd1dFSjBvKLypgJsGMgai6QFEmy86LBb1_aMTteakn6JJbKK_hCFNJ4heYxgkuZobm-jIK8HRvTF4vGPDdRTtw7cO",
        "refunded": false,
        "refunds": {
          "object": "list",
          "data": [
          ],
          "has_more": false,
          "total_count": 0,
          "url": "/v1/charges/ch_3Lz2mNEwMOwWEJ0o1VLsfUKa/refunds"
        },
        "review": null,
        "shipping": null,
        "source": null,
        "source_transfer": null,
        "statement_descriptor": null,
        "statement_descriptor_suffix": null,
        "status": "succeeded",
        "transfer_data": null,
        "transfer_group": null
      }
    ],
    "has_more": false,
    "total_count": 1,
    "url": "/v1/charges?payment_intent=pi_3Lz2mNEwMOwWEJ0o1hBgGSSx"
  },
  "client_secret": "pi_3Lz2mNEwMOwWEJ0o1hBgGSSx_secret_miFWudPfSnQQYisRH0Wnxyrla",
  "confirmation_method": "automatic",
  "created": 1667241131,
  "currency": "usd",
  "customer": null,
  "description": null,
  "invoice": null,
  "last_payment_error": null,
  "livemode": false,
  "metadata": {
  },
  "next_action": null,
  "on_behalf_of": null,
  "payment_method": "pm_1Lz2mcEwMOwWEJ0oXyeBRuaO",
  "payment_method_options": {
    "card": {
      "installments": null,
      "mandate_options": null,
      "network": null,
      "request_three_d_secure": "automatic"
    },
    "link": {
      "persistent_token": null
    }
  },
  "payment_method_types": [
    "card",
    "link"
  ],
  "processing": null,
  "receipt_email": null,
  "review": null,
  "setup_future_usage": null,
  "shipping": null,
  "source": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": null
}