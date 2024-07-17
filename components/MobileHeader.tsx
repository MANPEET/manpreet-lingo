import {MobileSidebar} from "./MobileSidebar"


export const MobileHeader = () =>{
  return (
    <nav className="lg:hidden flex px-6 h-[50px] bg-green-500 items-center w-full fixed top-0 border-b z-50">
      <MobileSidebar />
    </nav>
  )
}