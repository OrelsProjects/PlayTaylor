"use client";

import React, { useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  slideAnimationProps,
  selectedTextCorrect,
  selectedTextIncorrect,
  selectedTextFlow,
  question,
  answers,
  sectionText,
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
    // slide animation
    {...slideAnimationProps}
    className={cn(
      "w-full h-full min-h-[224px] relative flex justify-center items-center z-10 py-6 px-3",
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

const SignUpCompleted = () => (
  <div
    key={"completed-sign-up"}
    className="w-full aspect-video md:h-44 rounded-lg relative"
  >
    <Card className="w-full h-fit flex flex-col justify-center items-center gap-6 py-6 px-8">
      <TextWithLineBreaks
        text={`It is Enchanting to meet you!`}
        className="text-primary-gradient font-bold text-center text-xl"
      />
      <p className={cn("text-base text-center", roboto.className)}>
        In the upcoming weeks, you&apos;ll receive all the updates about the new
        game, as well as access to play it!
      </p>
      <TextWithLineBreaks
        text={`We found wonderland,\nand you are about to get lost in it )`}
        className={cn("text-base font-medium text-center", roboto.className)}
      />
    </Card>
  </div>
);

const SignUpForm: React.FC<{
  onSignupCompleted: (email: string) => Promise<void>;
  loading: boolean;
}> = ({ onSignupCompleted, loading }) => {
  const [signUpCompleted, setSignUpCompleted] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: values => {
      if (!values.email) {
        formik.setFieldError("email", "Email is required");
      } else {
        onSignupCompleted(values.email).finally(() => {
          setSignUpCompleted(true);
          setTimeout(() => {
            setSignUpCompleted(false);
          }, 20000);
        });
      }
    },
  });

  return (
    <AnimatePresence mode="popLayout">
      {signUpCompleted ? (
        <SignUpCompleted key="sign-up-completed" />
      ) : (
        <Card className="w-full h-fit flex flex-col justify-center items-center gap-8 py-6 px-8">
          <TextWithLineBreaks
            text={`Sign up now to get access to the new\n Taylor Swift Trivia game!`}
            className="text-primary-gradient font-bold text-center"
          />
          <form
            key="sign-up-form"
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
        </Card>
      )}
    </AnimatePresence>
  );
};

const MainCard = ({
  selectedText,
  isSignUpStage,
  showSignUp,
  // signUpCompleted,
  loadingSignUp,
  handleAnswer,
  onSignupCompleted,
}: {
  selectedText: string | null;
  isSignUpStage: boolean;
  showSignUp: boolean;
  // signUpCompleted: boolean
  loadingSignUp: boolean;
  handleAnswer: (isCorrect: boolean) => void;
  onSignupCompleted: (email: string) => Promise<void>;
}) => {
  const [didSignUpComplete, setDidSignUpComplete] = useState(false);

  return (
    <div className="w-full h-full md:max-h-[360px] flex">
      <AnimatePresence mode="popLayout">
        {!selectedText && !isSignUpStage && (
          <div
            key="no-selected-text"
            className={cn(
              "w-full max-h-[550px] md:h-[360px] rounded-lg relative",
              {
                "absolute inset-0": selectedText,
              },
            )}
          >
            <Card
              src="/landing-card-left-mobile.png"
              className="w-full h-fit shadow-md rounded-lg flex flex-row justify-start items-center"
            >
              <div className="w-full h-full flex flex-col md:flex-row md:justify-between items-center py-6 px-8 md:px-14 gap-8 md:gap-32">
                <div className="w-fit h-full flex flex-col gap-2.5">
                  <TextWithLineBreaks
                    text={question}
                    className="text-[28px] md:text-[40px] leading-8 md:leading-[56px] font-bold text-background text-start"
                  />
                  <p className="text-background font-semibold">
                    100 Swifties have already answered!
                  </p>
                </div>
                <div className="w-full md:w-fit h-fit grid grid-cols-[repeat(var(--answers-in-row-landing-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--answers-in-row-landing),minmax(0,1fr))] gap-4">
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
          <motion.div
            {...slideAnimationProps}
            key={"selected-text-card"}
            className="w-full aspect-video md:h-44 rounded-lg relative"
          >
            <Card
              src="/landing-card-right.png"
              className="w-full h-fit rounded-lg shadow-md"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  {...slideAnimationProps}
                  key={selectedText}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <TextWithLineBreaks
                    text={selectedText}
                    className="text-[28px] leading-8 font-bold text-background text-center"
                  />
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {showSignUp && (
          <div
            key={selectedText}
            className="w-full aspect-video md:h-44 rounded-lg relative"
          >
            <SignUpForm
              onSignupCompleted={(email: string) => {
                return onSignupCompleted(email);
              }}
              loading={loadingSignUp}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Section = ({
  title,
  body,
  image,
  className,
}: {
  title: string;
  body: string;
  className?: string;
  image?: {
    src: string;
    alt: string;
  };
}) => (
  <div className={cn("w-full h-fit flex flex-col gap-6", className)}>
    <div className="w-full h-fit flex flex-col gap-4">
      <h3 className="font-bold text-xl text-foreground">{title}</h3>
      <p className="font-medium">{body}</p>
    </div>

    {image && (
      <Image
        // src="/Manuscript.png"
        src={image.src}
        alt={image.alt}
        fill
        className="!relative !w-full !h-[152px] object-cover object-top rounded-2xl"
      />
    )}
  </div>
);

const BottomSignUpCard = ({
  loadingSignUp,
  onSignupCompleted,
}: {
  loadingSignUp: boolean;
  onSignupCompleted: (email: string) => Promise<void>;
}) => {
  const [showSignUp, setShowSignUp] = React.useState(false);

  return (
    <AnimatePresence mode="popLayout">
      {!showSignUp ? (
        <Card
          src="/landing-card-right.png"
          className="w-full h-fit flex flex-col justify-center items-center gap-6"
        >
          {/* <motion.div
              {...slideAnimationProps}
              key="sign-up-button"
              className="w-full h-fit flex flex-col justify-center items-center gap-6 py-6 px-8"
            > */}
          <TextWithLineBreaks
            text={`Think you’ve got what it takes to shine shine shine? Then sign up and play play play!`}
            className="text-background font-medium text-center"
          />
          <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
          {/* </motion.div> */}
        </Card>
      ) : (
        <SignUpForm
          onSignupCompleted={(email: string) => {
            return onSignupCompleted(email);
          }}
          loading={loadingSignUp}
        />
      )}
    </AnimatePresence>
  );
};

export default function LandingPage() {
  const [selectedText, setSelectedText] = React.useState<string | null>(null);
  const [showSignUp, setShowSignUp] = React.useState(false);
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
      // }, 400000)
    }, selectedTextFlow[i].duration);
  };

  const isSignUpStage = useMemo(() => showSignUp, [showSignUp]);

  const onSignupCompleted = async (email: string) => {
    if (loadingSignUp) return;
    setLoadingSignUp(true);
    try {
      await axios.post("api/sign-interested-user", { email });
    } catch (error) {
    } finally {
      // setSignUpCompleted(true)
      setLoadingSignUp(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-start items-center px-6 py-6 md:px-20 md:py-20 relative gap-6 overflow-auto bg-background",
        montserratAlternates.className,
      )}
    >
      <MainCard
        selectedText={selectedText}
        isSignUpStage={isSignUpStage}
        showSignUp={showSignUp}
        // signUpCompleted={signUpCompleted}
        loadingSignUp={loadingSignUp}
        handleAnswer={handleAnswer}
        onSignupCompleted={onSignupCompleted}
      />
      {sectionText.map(({ title, body, src, alt }) => (
        <Section
          key={title}
          title={title}
          body={body}
          className="md:hidden"
          image={
            src && alt
              ? {
                  src,
                  alt,
                }
              : undefined
          }
        />
      ))}
      <div className="hidden md:flex flex-row gap-[54px]">
        <div className="flex flex-col gap-10 flex-shrink">
          {sectionText.map(({ title, body }) => (
            <Section key={title} title={title} body={body} />
          ))}
        </div>
        <Image
          src="/taylor-cat.png"
          alt="taylor-cat"
          width={300}
          height={300}
          className=" rounded-2xl"
        />
      </div>
      <BottomSignUpCard
        loadingSignUp={loadingSignUp}
        onSignupCompleted={onSignupCompleted}
      />
    </div>
  );
}
