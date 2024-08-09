"use client";

import GoogleLogin from "../../../components/auth/googleLogin";
import AppleLogin from "../../../components/auth/appleLogin";
import { montserratAlternates } from "../../../lib/utils/fontUtils";
import { cn } from "../../../lib/utils";

const Auth = () => {
  return (
    <div
      className={cn(
        "h-screen w-screen flex flex-col items-center pt-36 gap-10",
        montserratAlternates.className,
      )}
    >
      <h3 className="text-[32px] leading-[32px] font-normal text-black">
        Log in or Sign up
      </h3>
      <div className="w-fit flex flex-col gap-4 rounded-xl">
        <GoogleLogin signInTextPrefix="Sign in with" />
        <AppleLogin signInTextPrefix="Sign in with" />
      </div>
    </div>
  );
};

export default Auth;
