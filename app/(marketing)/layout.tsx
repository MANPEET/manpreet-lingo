import type { PropsWithChildren } from "react";

import {Header} from "./header";
import {Footer} from "./footer";



const Layout = ({ children }: PropsWithChildren) =>{
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center ">
        { children }
      </main>
      <Footer />
    </div>
  )
}

export default Layout;