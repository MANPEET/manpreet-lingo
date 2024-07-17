import { getUserProgress, getuserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/StickyWrapper";
import { FeedWrapper } from "@/components/FeedWrapper";
import Image from "next/image";
import { Items } from "./items";
import { Promo } from "@/components/ui/promo";

const ShopPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getuserSubscription()

  const [userProgress,userSubscription] = await Promise.all([userProgressData,userSubscriptionData]);

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
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/shop.svg" width={90} height={90} alt="shop" />
          <h1 className="text-center font-bold text-neutral-800 text-xl my-6">
            Shop
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Spend your points on cool stuff.
          </p>
          <Items 
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;
