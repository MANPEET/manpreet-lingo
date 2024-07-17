
import Image from "next/image"
import {Button} from "@/components/ui/button"
import Link from "next/link"

export const Promo = () => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-x-2">
          <Image 
            src="/unlimited.svg"
            width={26}
            height={26}
            alt="unlimited"
          />
          <h3 className="text-lg font-bold">Switch to Pro</h3>
        </div>
        <p className="text-muted-foreground">Get unlimited hearts and more!</p>
      </div>
      <Button asChild variant="super" className="w-full" size="lg">
        <Link href="/shop">
           upgrade today
        </Link>
      </Button>
    </div>
  )
}