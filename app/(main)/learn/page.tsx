import React from 'react';
import {getUserProgress , getUnits, getCourseProgress, getLessonPercentage, getuserSubscription} from "@/db/queries"
import {redirect} from "next/navigation"
import {StickyWrapper} from "@/components/StickyWrapper"
import {FeedWrapper} from "@/components/FeedWrapper"
import {Header} from "@/components/Header"
import {Unit} from "./Unit"
import { UserProgress } from '@/components/user-progress';
import { Promo } from '@/components/ui/promo';
import { Quests } from '@/components/ui/Quests';



const LearnPage = async() => {
  const userProgressData = getUserProgress()
  const courseProgressData = getCourseProgress()
  const lessonPercentageData = getLessonPercentage()
  const unitsData = getUnits()
  const userSubscriptionData = await getuserSubscription()
  
  const [userProgress, units, courseProgress, lessonPercentage, userSubscription] = await Promise.all([userProgressData, unitsData,courseProgressData,lessonPercentageData, userSubscriptionData])

  if(!userProgress || !userProgress.activeCourse){
    redirect("/courses")
  }
  const isPro = !!userSubscription?.isActive

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
        <Header title="Spanish" />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id= {unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons= {unit.lessons}
              activeLessons = {courseProgress?.activeLesson}
              activeLessonsPercentage = {lessonPercentage }
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
};

export default LearnPage