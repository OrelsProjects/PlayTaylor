import Script from "next/script";
import React from "react";

interface AdTriviaProps {}

const AdTrivia: React.FC<AdTriviaProps> = () => {
  return (
    <div className="absolute h-full w-full z-40">
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          width: "100%",
          height: "100%",
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-5564324340797928"
        data-ad-slot="2469269444"
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
  );
};

export default AdTrivia;
