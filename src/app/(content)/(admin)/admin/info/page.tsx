"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Butterfly = ({ number }: { number: number }) => (
  <div className="w-10 h-[30px] relative flex flex-shrink-0 mt-1">
    <Image
      src={"/numbers/butterfly.png"}
      alt={"butterfly" + number}
      fill
      className="flex-shrink-0 !relative !w-10 !h-[30px] z-10"
    />
    <span className="w-full h-full absolute top-auto left-auto text-white z-20 flex justify-center items-center mt-0.5">
      {number}
    </span>
  </div>
);

const InfoComponent = ({ number, text }: { number: number; text: string }) => {
  return (
    <div className="flex flex-row gap-4 pl-3 pr-4 py-3">
      <Butterfly number={number} />
      <div className="flex flex-col">
        <span className="tracking-[0.5px] font-plusJakartaSans">{text}</span>
        <span className="tracking-[0.25px] font-roboto text-sm">
          Supporting line text lorem ipsum dolor sit amet consectetur
        </span>
      </div>
    </div>
  );
};

export default function RoomPage() {
  const router = useRouter();

  return (
    <div className="pt-[88px] px-[40px] flex flex-col gap-7">
      {/* pRESETN text exactly as shown */}
      <p className="text-[32px] leading-10 text-center">
        You are now the <br className="md:hidden" />
        Chairman of
        <br className="md:hidden" />
        the game
      </p>
      <div className="flex flex-col items-start">
        <InfoComponent number={1} text="Create the game" />
        <InfoComponent number={2} text="Send the link" />
        <InfoComponent number={3} text="Control the game" />
        <InfoComponent number={4} text="Big screen or mobile" />
      </div>
      <div className="w-full flex justify-center items-center ">
        <Button
          onClick={() => {
            router.push("/admin/room/create");
          }}
          className="w-full"
        >
          Got it, let&apos;s continue
        </Button>
      </div>
    </div>
  );
}
