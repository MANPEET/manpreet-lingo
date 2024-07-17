"use server"

import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"
import { auth, currentUser} from "@clerk/nextjs/server"
import {getUserProgress, getCourseById, getuserSubscription} from "@/db/queries"
import db from "@/db/drizzle"
import { challenges, challengeProgress, userProgress } from "@/db/schema"
import { eq,and } from "drizzle-orm"

const POINTS_TO_REFILL =10

export const upsertUserProgress = async (courseId: number) => {
  const {userId} = await auth()
  const user = await currentUser()

  if(!user || !userId) {
    throw new Error("User not found")
  }

  const course = await getCourseById(courseId)
  

  if(!course){
    throw new Error("Course not found")
  }

  const existingUserProgress = await getUserProgress()

  if(existingUserProgress){
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    })

    revalidatePath("/courses")
    revalidatePath("/learn")
    redirect("/learn")
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg"
  })
  revalidatePath("/courses")
  revalidatePath("/learn")
  redirect("/learn")
}

export const reduceHearts = async(challengeId : number) => {
  const {userId} = await auth()

  if(!userId) throw new Error("user not found")

  const currentUserProgress = await getUserProgress()
  const userSubscription= await getuserSubscription()

  const exisitingChallengeProgress = await db.query.challengeProgress.findFirst({
    where:and(
      eq(challengeProgress.userId,userId),
      eq(challengeProgress.challengeId,challengeId)
    )
  })

  const isPractice = !!exisitingChallengeProgress;

  if(isPractice){
    return {error : "practice"}
  }


  if(!currentUserProgress) throw new Error("user-Progress not found")

  if(userSubscription?.isActive){
    return {error : "subscribed"}
  }

  if(currentUserProgress.hearts === 0){
    return {error : "hearts"}
  }

  await db.update(userProgress).set({
    hearts: Math.max(currentUserProgress.hearts - 1, 0)
  }).where(eq(userProgress.userId,userId))

  const challenge = await db.query.challenges.findFirst({
    where:eq(challenges.id,challengeId)
  })

  if(!challenge) throw new Error("Challenge not found")

  const lessonId = challenge.lessonId;

  revalidatePath("/learn")
  revalidatePath("/shop")
  revalidatePath("/quests")
  revalidatePath("/leaderboard")
  revalidatePath(`/lesson/${lessonId}`)
}

export const Refillhearts = async() =>{
  const currentUserProgress = await getUserProgress()

  if(!currentUserProgress) throw new Error("user-Progress not found")

  if(currentUserProgress.hearts === 5) throw new Error("hearts already full")

  if(currentUserProgress.points < POINTS_TO_REFILL) throw new Error("not enough points")

  await db.update(userProgress).set({
    hearts:5,
    points:currentUserProgress.points - POINTS_TO_REFILL
  }).where(eq(userProgress.userId, currentUserProgress.userId))

  revalidatePath("/learn")
  revalidatePath("/shop")
  revalidatePath("/quests")
  revalidatePath("/leaderboard")
}