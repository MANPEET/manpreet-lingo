"use client"

import {Dialog,DialogTitle,DialogContent,DialogDescription,DialogFooter,DialogHeader} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import { useEffect,useState} from "react"
import {useRouter} from "next/navigation"
import {useExitModal} from "@/store/use-exit-modal"
import Image from "next/image"
  
export const ExitModal = () =>{
  const router= useRouter()
  const [isClient,setIsClient]=useState(false)

  const {isOpen,close}= useExitModal()

  useEffect(() =>setIsClient(true),[])

  if(!isClient) return null
  return(
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src="/mascot_sad.svg" width={80} height={80} alt="Mascot" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Wait don't go!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You're about to leave the lesson. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button variant="primary" size="lg" onClick={close} className="w-full">
              Keep Learning
            </Button>
            <Button 
              variant="dangerOutline" 
              size="lg" 
              onClick={() =>{
                close();
                router.push("/learn")
              }}>
              End Session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}