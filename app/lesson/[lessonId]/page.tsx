import {getCourses,getLesson,getUserProgress,getuserSubscription} from "@/db/queries"
import { redirect } from "next/navigation"
import { Quiz } from "../Quiz"

type Props = {
  params: {
    lessonId: number;
  }
}
const lessonPage = async ({params}:Props) =>{
    const lessonData = getLesson(params.lessonId)
    const userProgressData = getUserProgress()
    const userSubscriptionData= await getuserSubscription()

    const [lesson, userProgress,userSubscription] = await Promise.all([lessonData, userProgressData,userSubscriptionData])

    if(!lesson || !userProgress) redirect("/learn")

  const initialPercentage = lesson.challenges.filter(challenge => challenge.completed).length / lesson.challenges.length * 100
    return (
      <Quiz
        initialLessonId= {lesson.id}
        initialPercentage= {initialPercentage}
        initialHearts = {userProgress.hearts}
        initialLessonChallanges = {lesson.challenges}
        userSubscription= {userSubscription || null}
      />
    )
  }

export default lessonPage