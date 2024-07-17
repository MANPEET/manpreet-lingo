import {
  getTopTenUsers,
  getUserProgress,
  getuserSubscription,
} from "@/db/queries";
import { redirect } from "next/navigation";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/StickyWrapper";
import { FeedWrapper } from "@/components/FeedWrapper";
import Image from "next/image";
import { Items } from "./items";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Separator } from "@/components/ui/separator";
import { Promo } from "@/components/ui/promo";
import { Quests } from "@/components/ui/Quests";

const leaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getuserSubscription();
  const topTenUsersData = getTopTenUsers();

  const [userProgress, userSubscription, topTenUsers] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    topTenUsersData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src="/leaderboard.svg"
            width={90}
            height={90}
            alt="leaderboard"
          />
          <h1 className="text-center font-bold text-neutral-800 text-xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among others learners in the community.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          {topTenUsers.map((userProgress, index) => (
            <div
              key={userProgress.userId}
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className="font-bold text-line-700 mr-4">{index + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage 
                  className="object-cover"
                  src={userProgress.userImageSrc}
                />
              </Avatar>
              <p className="font-bold text-neutral-800 flex-1">{userProgress.userName}</p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default leaderboardPage;
