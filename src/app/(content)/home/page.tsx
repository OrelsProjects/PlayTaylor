"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import Carousel from "../../../components/ui/carousel";
import useGame from "../../../lib/hooks/useGame";
import AdTrivia from "../../../components/ads/adTrivia";
import { QuestionType } from "../../../models/question";
import { PayPalButtons } from "@paypal/react-paypal-js";
import GooglePayButton from "@google-pay/button-react";
import { ThemeProvider } from "../../providers/ThemeProvider";

const carouselItems = [
  { title: "Mastermind", value: "trivia", image: "/Mastermind.png" },
  {
    title: "The manuscript",
    value: "sing-the-lyrics",
    image: "/Manuscript.png",
  },
  { title: "Cassandra", value: "swipe", image: "/Cassandra.png" },
];

export default function Home() {
  const { game, setGame } = useGame();
  const [defaultSelected, setDefaultSelected] = useState(0);

  useEffect(() => {
    const selected = carouselItems.findIndex(item => item.value === game);
    if (selected !== -1) {
      setDefaultSelected(selected);
    }
  }, [game]);

  return (
    <div className="h-full w-full flex flex-col justify-center gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="w-full h-fit flex justify-center items-center text-start title-main">
          Players gonna play, play...
        </h1>
        <span className="text-primary">Choose a game:</span>
      </div>
      <Carousel
        selected={defaultSelected}
        items={carouselItems}
        onItemSelected={item => {
          setGame(item.value as QuestionType);
        }}
      />
      {/* <AdTrivia /> */}
      <Button asChild className="w-fit self-end mt-auto">
        <Link href={`/instructions`}>Play</Link>
      </Button>
      <div className="w-96">
        {/* <GooglePayButton
          className="w-96 mb-1.5"
          environment="TEST"
          buttonColor="black"
          buttonType="buy"
          buttonRadius={9999}
          buttonSizeMode="fill"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: "CARD",
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["MASTERCARD", "VISA"],
                },
                tokenizationSpecification: {
                  type: "PAYMENT_GATEWAY",
                  parameters: {
                    gateway: "example",
                    gatewayMerchantId: "exampleGatewayMerchantId",
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: "12345678901234567890",
              merchantName: "Demo Merchant",
            },
            transactionInfo: {
              totalPriceStatus: "FINAL",
              totalPriceLabel: "Total",
              totalPrice: "1.00",
              currencyCode: "USD",
              countryCode: "US",
            },
            callbackIntents: ["PAYMENT_AUTHORIZATION"],
          }}
          onLoadPaymentData={paymentRequest => {
            console.log("Success", paymentRequest);
          }}
          onPaymentAuthorized={paymentData => ({ transactionState: "SUCCESS" })}
        />
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
        /> */}
      </div>
    </div>
  );
}
