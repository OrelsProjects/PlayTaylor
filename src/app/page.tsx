"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { GiQueenCrown as Crown } from "react-icons/gi";

import {
  slideAnimationProps,
  selectedTextCorrect,
  selectedTextIncorrect,
  selectedTextFlow,
  question,
  answers,
  sectionText,
  slideFromTopAnimationProps,
} from "./consts";
import { Input } from "../components/ui/input";
import { useFormik } from "formik";
import { montserratAlternates, roboto } from "../lib/utils/fontUtils";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/ui/loading";
import { Skeleton } from "../components/ui/skeleton";

interface InterestedUsersCount {
  loading: boolean;
  data: { count: number };
}

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
    {...slideAnimationProps}
    className={cn(
      "w-full h-full md:min-h-[224px] relative flex justify-center items-center z-10",
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
  <motion.div
    {...slideAnimationProps}
    key={"completed-sign-up"}
    className="w-full md:h-full rounded-lg relative shadow-lg"
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
        text={`We found wonderland,\nand you are about to get lost in it :)`}
        className={cn("text-base font-medium text-center", roboto.className)}
      />
    </Card>
  </motion.div>
);

const SignUpForm: React.FC<{
  isSignUpCompleted: boolean;
  onSignupCompleted: (email: string) => Promise<void>;
  loading: boolean;
}> = ({ isSignUpCompleted, onSignupCompleted, loading }) => {
  const [signUpCompleted, setSignUpCompleted] = useState(isSignUpCompleted);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: values => {
      if (!values.email) {
        formik.setFieldError("email", "Email is required");
      } else {
        onSignupCompleted(values.email)
          .then(() => {
            setSignUpCompleted(true);
          })
          .catch(() => {
            toast.error("Something went wrong.. try again? 💪");
          });
      }
    },
  });
  // iin order to make the next animation appear on top of the previous one, we need to use the AnimatePresence component from Framer Motion. This component will handle the animations of the children components, and it will make sure that only one child is rendered at a time. This way, we can switch between the sign-up form and the sign-up completed message with a smooth animation.
  return (
    <>
      <AnimatePresence mode="popLayout">
        {signUpCompleted && <SignUpCompleted key="sign-up-completed" />}
      </AnimatePresence>
      {!signUpCompleted && (
        <AnimatePresence mode="popLayout">
          <Card
            key="sign-up-form"
            className="w-full h-fit flex flex-col justify-center items-center gap-8 py-6 px-8 border border-foreground/20"
          >
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
        </AnimatePresence>
      )}
    </>
  );
};

const MainCard = ({
  selectedText,
  isSignUpStage,
  showSignUp,
  signUpCompleted,
  loadingSignUp,
  handleAnswer,
  interestedUsersCount,
  onSignupCompleted,
}: {
  selectedText: string | null;
  isSignUpStage: boolean;
  showSignUp: boolean;
  signUpCompleted: boolean;
  loadingSignUp: boolean;
  interestedUsersCount: InterestedUsersCount;
  handleAnswer: (isCorrect: boolean) => void;
  onSignupCompleted: (email: string) => Promise<void>;
}) => {
  const interestedCount = useMemo(() => {
    if (interestedUsersCount.data.count > 100) {
      return 100 + interestedUsersCount.data.count;
    } else {
      return 100 + interestedUsersCount.data.count;
    }
  }, [interestedUsersCount.data.count]);

  return (
    <div className="w-full h-fit md:max-h-[320px] flex">
      <AnimatePresence mode="popLayout">
        {!selectedText && !isSignUpStage && (
          <div
            key="no-selected-text"
            className={cn("w-full h-fit md:h-[320px] rounded-lg relative", {
              "absolute inset-0": selectedText,
            })}
          >
            <Card
              src="/landing-card-left-mobile.png"
              className="w-full h-fit shadow-md rounded-lg flex flex-row justify-center items-center"
            >
              <div className="w-full h-full flex flex-col md:flex-row justify-between items-center py-8 px-5 md:px-14 gap-8 md:gap-32">
                <div className="w-fit max-w-full md:max-w-[60%] h-full flex flex-col gap-2.5">
                  <TextWithLineBreaks
                    text={question}
                    className="text-[28px] md:text-[40px] leading-9 md:leading-[56px] font-bold text-background text-start"
                  />
                  <div className="w-full h-fit flex flex-row gap-2">
                    {interestedUsersCount.loading ? (
                      <Skeleton className="w-80 h-6 bg-background/25" />
                    ) : (
                      <>
                        <Crown className="fill-background h-6 w-6" />
                        <p className="text-background font-semibold">
                          {interestedCount} Swifties have already answered!
                        </p>
                      </>
                    )}
                  </div>
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
            className="w-full aspect-video md:aspect-auto md:h-fit rounded-lg relative"
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
            className="w-full aspect-video md:aspect-auto md:h-fit rounded-lg relative"
          >
            <SignUpForm
              isSignUpCompleted={signUpCompleted}
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
  <motion.div className={cn("w-full h-fit flex flex-col gap-6", className)}>
    <div className="w-full h-fit flex flex-col gap-4">
      <h3 className="font-bold text-xl text-foreground">{title}</h3>
      <p className="font-medium">{body}</p>
    </div>

    {image && (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="!relative !w-full !h-[152px] object-cover rounded-2xl"
      />
    )}
  </motion.div>
);

const BottomSignUpCard = ({
  loadingSignUp,
  signUpCompleted,
  onShareLink,
  onSignupCompleted,
}: {
  loadingSignUp: boolean;
  signUpCompleted: boolean;
  onShareLink: () => void;
  onSignupCompleted: (email: string) => Promise<void>;
}) => {
  const [showSignUp, setShowSignUp] = React.useState(false);

  return (
    <AnimatePresence mode="popLayout">
      {signUpCompleted ? (
        <Card
          key="sign-up-completed-bottom"
          src="/landing-card-right.png"
          className="w-full h-fit flex flex-col justify-center items-center gap-6"
        >
          <TextWithLineBreaks
            text={`<strong>It’s nice to have a friend!</strong> \nShare the game with your fellow Swifties! 🎉`}
            className="text-background text-2xl md:text-4xl font-medium text-center"
          />
          <Button onClick={() => onShareLink()}>Share link</Button>
        </Card>
      ) : !showSignUp ? (
        <Card
          key="sign-up-bottom"
          src="/landing-card-right.png"
          className="w-full h-fit flex flex-col justify-center items-center gap-6"
        >
          <TextWithLineBreaks
            text={`Think you’ve got what it takes to shine shine shine?\n Then sign up and <strong>play play play!</strong>`}
            className="text-background text-2xl md:text-4xl font-medium text-center"
          />
          <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
        </Card>
      ) : (
        <SignUpForm
          isSignUpCompleted={signUpCompleted}
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
  const [signUpCompleted, setSignUpCompleted] = React.useState(false);
  const interestedUsersCountLoading = useRef(false);
  const [interestedUsersCount, setInterestedUsersCount] =
    React.useState<InterestedUsersCount>({
      loading: false,
      data: { count: 0 },
    });

  const selectedTextInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (interestedUsersCountLoading.current) return;
    interestedUsersCountLoading.current = true;
    axios
      .get("api/interested-user")
      .then(({ data }) => {
        setInterestedUsersCount({
          loading: false,
          data: {
            count: data.count,
          },
        });
      })
      .catch(() => {
        setInterestedUsersCount({
          loading: false,
          data: {
            count: 0,
          },
        });
      })
      .finally(() => {
        interestedUsersCountLoading.current = false;
      });
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setSelectedText(selectedTextCorrect);
    } else {
      setSelectedText(selectedTextIncorrect);
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
      await axios.post("api/interested-user", { email });
      setSignUpCompleted(true);
    } catch (error) {
      toast.error("Something went wrong.. try again? 💪");
    } finally {
      setLoadingSignUp(false);
    }
  };

  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: "Check out this app!",
          text: "I found this amazing app!",
          url: window.location.href, // or any URL you want to share
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      console.log("Web Share API is not supported in this browser.");
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-start items-center px-5 py-6 md:px-20 xl:px-40 md:py-20 relative gap-6 overflow-auto bg-background",
        montserratAlternates.className,
      )}
    >
      <MainCard
        signUpCompleted={signUpCompleted}
        selectedText={selectedText}
        isSignUpStage={isSignUpStage}
        showSignUp={showSignUp}
        loadingSignUp={loadingSignUp}
        handleAnswer={handleAnswer}
        interestedUsersCount={interestedUsersCount}
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
      <motion.div
        {...slideFromTopAnimationProps}
        className="hidden md:flex flex-row gap-[54px]"
      >
        <div className="flex flex-col gap-10 flex-shrink">
          {sectionText.map(({ title, body }) => (
            <Section key={title} title={title} body={body} />
          ))}
        </div>
        <Image
          src="/taylor-sabrina.png"
          alt="landing-page-taylor"
          width={300}
          height={300}
          className=" rounded-2xl"
        />
      </motion.div>
      <BottomSignUpCard
        onShareLink={() => handleShare()}
        loadingSignUp={loadingSignUp}
        onSignupCompleted={onSignupCompleted}
        signUpCompleted={signUpCompleted}
      />
    </div>
  );
}
