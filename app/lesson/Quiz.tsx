"use client";

import { useState, useTransition } from "react";
import { Header } from "./Header";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { QuestionBubble } from "./QuestionBubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio,useWindowSize,useMount } from "react-use";
import Image from "next/image"
import { ResultCard } from "./ResultCard"; 
import {useRouter} from "next/navigation";
import Confetti from "react-confetti"
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

type Props = {
  initialLessonId: number;
  initialPercentage: number;
  initialHearts: number;
  initialLessonChallanges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:  | (typeof userSubscription.$inferSelect & {
      isActive: boolean;
    })
  | null;
};

export const Quiz = ({
  initialLessonId,
  initialPercentage,
  initialHearts,
  initialLessonChallanges,
  userSubscription,
}: Props) => {

  const {open : openHeartsModal}= useHeartsModal()
  const {open : openPracticeModal}= usePracticeModal()

  const router= useRouter()
  const [pending, startTransition] = useTransition();

  const {width,height} = useWindowSize();

  useMount(() =>{
    if(initialPercentage === 100){
      openPracticeModal()
    }
  })

  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });

  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true })

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() =>{
    return initialPercentage === 100 ? 0 : initialPercentage
  });
  const [lessonId] = useState(initialLessonId);
  const [challenges] = useState(initialLessonChallanges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = initialLessonChallanges.findIndex(
      (challenge) => !challenge.completed,
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "none" | "wrong">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((currIndex) => currIndex + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options?.find((option) => option.correct);

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id).then((res) => {
          if (res?.error === "hearts") {
            openHeartsModal()
            return;
          }
          correctControls.play();
          setStatus("correct");
          setPercentage((prev) => prev + 100 / challenges.length);

          if (initialPercentage === 100) {
            setHearts((prev) => Math.min(prev + 1, 5));
          }
        });
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id).then((res) => {
          if (res?.error === "hearts") {
            openHeartsModal()
            return;
          }
          setStatus("wrong");

          incorrectControls.play();

          if (!res?.error) {
            setHearts((prev) => Math.max(prev - 1, 0));
          }
        });
      });
    }
  };

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={10000} />
        <div className="flex flex-col items-center justify-center gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center h-full">
          <Image src="/finish.svg" width={100} height={100} alt="finish" className="hidden lg:block"/>
          <Image src="/finish.svg" width={50} height={50} alt="finish" className="block lg:hidden"/>
          <h1 className="text-xl font-bold text-neutral-700 lg:text-3xl">
            Great job! <br/> You&apos; ve completed the lesson
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={userSubscription?.isActive ? Infinity  : hearts} />
          </div>
        </div>
        <Footer lessonId= {lessonId} status="completed" onCheck={() => router.push("/learn")}/>
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center mt-20">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onContinue} />
    </>
  );
};
