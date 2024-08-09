import React from "react";
import useAuth from "../../lib/hooks/useAuth";
import { InvalidCredentialsError } from "../../models/errors/InvalidCredentialsError";
import { toast } from "react-toastify";
import { UnknownUserError } from "../../models/errors/UnknownUserError";
import UserAlreadyExistsError from "../../models/errors/UserAlreadyExistsError";
import Loading from "../ui/loading";
import { FaGoogle } from "react-icons/fa";

interface GoogleLoginProps {
  className?: string;
  signInTextPrefix?: string;
}

export default function GoogleLogin({
  className,
  signInTextPrefix,
}: GoogleLoginProps) {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      toast.promise(signInWithGoogle(), {
        pending: "Signing in...",
      });
    } catch (error: any) {
      if (error instanceof InvalidCredentialsError) {
        toast.error("Invalid credentials");
      } else if (error instanceof UnknownUserError) {
        toast.error("Unknown user");
      } else if (error instanceof UserAlreadyExistsError) {
        toast.error("User already exists");
      } else {
        toast.error("Unknown error");
      }
    }
  };

  return (
    <div
      className={`w-72 h-12 flex flex-row gap-2 bg-primary text-primary-foreground justify-center items-center rounded-lg hover:cursor-pointer ${className}`}
      onClick={handleGoogleLogin}
    >
      {loading && <Loading className="w-7 h-7" />}
      <FaGoogle className="w-[18px] h-[18px] fill-primary-foreground" />
      <span>{signInTextPrefix} Google</span>
    </div>
  );
}
