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
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5564324340797928"
        crossOrigin="anonymous"
      ></Script>
      <ins
        className="adsbygoogle"
        // @ts-ignore
        style="display:block; text-align:center; width:100%; height:100px; background-color:rgba(0, 0, 0, 1);"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-5564324340797928"
        data-ad-slot="2469269444"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
};

export default AdTrivia;
