import Script from "next/script";
import React, { useEffect } from "react";
import { Logger } from "../../logger";

interface AdTriviaProps {}

const AdTrivia: React.FC<AdTriviaProps> = () => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (e: any) {
      Logger.error("Failed to load ads", { error: e });
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        textAlign: "center",
      }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-5564324340797928"
      data-ad-slot="2469269444"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdTrivia;
