"use client"

import Image from "next/image"
import {Button} from "@/components/ui/button";
import { useTransition } from "react";
import { Refillhearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";

type Props = {
  hearts: number
  points: number
  hasActiveSubscription: boolean
}

const POINTS_TO_REFILL =10

export const Items = ({hearts,points,hasActiveSubscription} : Props) =>{


  const [pending,startTransition] = useTransition()

  const onRefillhearts = () =>{
    if(pending || hearts === 5 || points < POINTS_TO_REFILL) return

    startTransition(() =>{
      Refillhearts()
    })
  }

  const onUpgrade = () =>{
    startTransition(() =>{
      createStripeUrl()
        .then(res => {
          if(res.data){
            window.location.href= res.data
          }
        })
    })
  }
  
  return (
    <ul className="w-full">
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image src="/heart.svg" width={60} height={60} alt="heart" />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Refill hearts
          </p>
        </div>
        <Button 
          onClick={onRefillhearts}
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
        >
          {hearts === 5 ? "full" : (
            <div className="flex items-center">
              <Image src="/points.svg" width={20} height={20} alt="points" />
              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </div>
      <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
        <Image src="unlimited.svg" width={60} height={60} alt="unlimited" />
        <div className="flex flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">Unlimited hearts</p>
        </div>

          <Button
            onClick={onUpgrade}
            disabled={pending}
          >
            {hasActiveSubscription ? "settings" : "upgrade"}
          </Button>
      </div>
    </ul>
  )
}
