import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";

export default function PaymentPage() {
  return (
    <PayPalButtons
      style={{
        color: "gold",
        shape: "pill",
        layout: "vertical",
        label: "pay",
        height: 40,
      }}
      onApprove={async (data, actions) => {
        console.log("onApprove", data, actions);
      }}
      onError={(err: any) => {
        console.log("onError", err);
      }}
    />
  );
}
