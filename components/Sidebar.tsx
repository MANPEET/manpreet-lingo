import {cn} from "@/lib/utils"
import Link from "next/link"
import { Loader } from "lucide-react"
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs"
import {SidebarItem} from "@/components/SidebarItem"
import Image from "next/image"

type Props = {
  className?: string; 
}

export const Sidebar = ({className} : Props) =>{
  return (
    <div className={cn("flex  h-full lg:w-[256px] lg:fixed left-0 top-0 border-r-2 flex-col",className)}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" width={40} height={40} alt="logo" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Lingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Learn" href="/learn" iconSrc="/learn.svg"/>
        <SidebarItem label="Leaderboard" href="/leaderboard" iconSrc="/leaderboard.svg"/>
        <SidebarItem label="quests" href="/quests" iconSrc="/quests.svg"/>
        <SidebarItem label="shop" href="/shop" iconSrc="/shop.svg"/>
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
          </ClerkLoaded>
        </ClerkLoading>
      </div>
    </div>
  )
}