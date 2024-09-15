"use client";

import React, { useMemo, useRef } from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  selectedTextCorrect,
  selectedTextIncorrect,
  selectedTextFlow,
  question,
  answers,
} from "./consts";
import { Input } from "../components/ui/input";
import { useFormik } from "formik";
import { montserratAlternates, roboto } from "../lib/utils/fontUtils";
import axios from "axios";

const TextWithLineBreaks = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const formattedText = text.replace(/\n/g, "<br/>");

  return (
    <p
      className={className}
      dangerouslySetInnerHTML={{ __html: formattedText }}
    />
  );
};

const Card = ({
  src,
  className,
  children,
}: {
  src?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    // slide left opacity
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -100, opacity: 0, transition: { duration: 0.5 } }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className={cn(
      "w-full h-full relative flex justify-center items-center z-10",
      { "bg-background rounded-lg": !src },
      className,
    )}
  >
    {src && (
      <Image
        src={src}
        alt="card"
        fill
        className="object-cover rounded-lg -z-10"
      />
    )}
    {children}
  </motion.div>
);

const SignUpForm: React.FC<{
  onSignupCompleted: (email: string) => void;
  loading: boolean;
}> = ({ onSignupCompleted, loading }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: values => {
      if (!values.email) {
        formik.setFieldError("email", "Email is required");
      } else {
        onSignupCompleted(values.email);
      }
    },
  });

  return (
    <form
      className="w-full h-full flex flex-col gap-3"
      onSubmit={formik.handleSubmit}
    >
      <Input
        type="email"
        name="email"
        placeholder="taytay@gmail.com"
        error={formik.errors.email}
        required
        value={formik.values.email}
        onChange={formik.handleChange}
      />
      <Button type="submit" isLoading={loading}>
        I am ready for it
      </Button>
    </form>
  );
};

export default function LandingPage() {
  const [selectedText, setSelectedText] = React.useState<string | null>(null);
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [signUpCompleted, setSignUpCompleted] = React.useState(false);
  const [loadingSignUp, setLoadingSignUp] = React.useState(false);

  const selectedTextInterval = useRef<NodeJS.Timeout | null>(null);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setSelectedText(selectedTextCorrect.text);
    } else {
      setSelectedText(selectedTextIncorrect.text);
    }
    // start flow, change text every 2 seconds
    let i = 0;

    selectedTextInterval.current = setInterval(() => {
      if (i === selectedTextFlow.length) {
        if (selectedTextInterval.current) {
          clearInterval(selectedTextInterval.current);
          selectedTextInterval.current = null;
        }
        setSelectedText(null);
        setShowSignUp(true);
        return;
      }

      i = i % selectedTextFlow.length;
      setSelectedText(selectedTextFlow[i].text);
      i++;
    }, selectedTextFlow[i].duration);
  };

  const isSignUpStage = useMemo(
    () => showSignUp || signUpCompleted,
    [showSignUp, signUpCompleted],
  );

  const onSignupCompleted = async (email: string) => {
    if (loadingSignUp) return;
    setLoadingSignUp(true);
    try {
      await axios.post("api/sign-interested-user", { email });
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
    } finally {
      setSignUpCompleted(true);
      setLoadingSignUp(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-start items-center px-6 py-6 md:px-20 md:py-20 relative",
        montserratAlternates.className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {!selectedText && !isSignUpStage && (
          <div
            key="no-selected-text"
            className={cn(
              "w-full max-h-[550px] md:h-[300px] rounded-lg relative",
              {
                "absolute inset-0": selectedText,
              },
            )}
          >
            <Card
              src="/landing-card-left-mobile.png"
              className="w-full h-full shadow-md rounded-lg flex flex-row justify-start items-center"
            >
              <div className="w-full h-full flex flex-col md:flex-row md:justify-start items-center py-6 px-8 md:px-14 gap-8 md:gap-32">
                <TextWithLineBreaks
                  text={question}
                  className="text-[28px] leading-8 font-bold text-background text-center"
                />
                <div className="w-fit h-fit grid grid-cols-[repeat(var(--answers-in-row-landing-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--answers-in-row-landing),minmax(0,1fr))] gap-4">
                  {answers.map(({ answer, isCorrect }) => (
                    <Button
                      key={answer}
                      variant="background"
                      className="w-full h-auto md:w-[120px] md:h-[120px] p-11 aspect-square"
                      onClick={() => handleAnswer(isCorrect)}
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {selectedText && !isSignUpStage && (
          <div
            key={selectedText}
            className="w-full aspect-video md:h-44 rounded-lg relative"
          >
            <Card
              src="/landing-card-right.png"
              className="w-full h-full rounded-lg shadow-md"
            >
              <div className="w-full h-full flex flex-col justify-center items-center">
                <TextWithLineBreaks
                  text={selectedText}
                  className="text-[28px] leading-8 font-bold text-background text-center"
                />
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {showSignUp && !signUpCompleted && (
          <div
            key={selectedText}
            className="w-full aspect-video md:h-44 rounded-lg relative"
          >
            <Card className="w-full h-full flex flex-col justify-center items-center gap-8 py-6 px-8">
              <TextWithLineBreaks
                text={`Sign up now to get access to the new\n Taylor Swift Trivia game!`}
                className="text-primary-gradient font-bold text-center"
              />
              <SignUpForm
                onSignupCompleted={onSignupCompleted}
                loading={loadingSignUp}
              />
            </Card>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {signUpCompleted && (
          <div
            key={selectedText}
            className="w-full aspect-video md:h-44 rounded-lg relative"
          >
            <Card className="w-full h-full flex flex-col justify-center items-center gap-6 py-6 px-8">
              <TextWithLineBreaks
                text={`It is Enchanting to meet you!`}
                className="text-primary-gradient font-bold text-center text-xl"
              />
              <p className={cn("text-base text-center", roboto.className)}>
                In the upcoming weeks, you&apos;ll receive all the updates
                about the new game, as well as access to play it!
              </p>
              <TextWithLineBreaks
                text={`We found wonderland,\nand you are about to get lost in it ;)`}
                className={cn(
                  "text-base font-medium text-center",
                  roboto.className,
                )}
              />
            </Card>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
