import {auth} from "@clerk/nextjs/server"
const allowedIds= ["user_2fdDaqIP3slEJNscK9levIKa0XW"]

export const getisAdmin = () => {
  const {userId}= auth();

  if(!userId) return false

  return true
}