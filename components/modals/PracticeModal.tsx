"use client"

import {Dialog,DialogTitle,DialogContent,DialogDescription,DialogFooter,DialogHeader} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import { useEffect,useState} from "react"
import {usePracticeModal} from "@/store/use-practice-modal"
import Image from "next/image"
  
export const  PracticeModal= () =>{
  const [isClient,setIsClient]=useState(false)

  const {isOpen,close}= usePracticeModal()

  

  useEffect(() =>setIsClient(true),[])

  if(!isClient) return null
  return(
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src="/heart.svg" width={100} height={100} alt="Mascot" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Practice Lesson
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Use practice lessons to regain hearts and points. You cannot loose
            hearts or points in practice lessons.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={close}
            >
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}