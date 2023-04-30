import styles from "@/styles/Home.module.scss";
import Link from "next/link";
import Image from "next/image";
import Login from "./Login";
import Logo from "../assets/images/logo.png"

export default function Navbar() {
  return (
    <header className="container mx-auto fixed top-0 left-0 right-0 z-40 w-full pt-0">
      <div className="px-5">
        <div className="relative flex">
          {/**/}
          <div className="flex w-full items-center justify-between rounded-3xl py-4 px-8 lg:p-10">
            <div className="opacity-0 absolute inset-0 -z-10 rounded-3xl bg-gel-black/50 transition-opacity duration-500" />
            <Link className="router-link-active w-20 router-link-exact-active mt-[-2px] flex transition-all duration-300 hover:opacity-60" href="/"> 
              <Image src={Logo}/>
            </Link>
            <nav className="relative z-10 transition-colors duration-300">
              <ul className="hidden flex-row items-center text-[15px] font-medium lg:flex [&>button]:px-10">
                <li>
                  <div className="relative inline-block w-full text-left">
                    <Link className="hover:opacity-75 lg:pl-5 lg:pr-5" href="/">
                      Home
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="relative inline-block w-full text-left">
                    <Link
                      className="hover:opacity-75 lg:pl-5 lg:pr-5"
                      href="/communities"
                    >
                      Communities
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="relative inline-block w-full text-left">
                    <Link
                      className="hover:opacity-75 lg:pl-5 lg:pr-5"
                      href="/store"
                    >
                      Store
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="relative inline-block w-full text-left">
                    <Link
                      className="hover:opacity-75 lg:pl-5 lg:pr-5"
                      href="/host"
                    >
                      Host
                    </Link>
                  </div>
                </li>
                {/*]*/}
                <li>
                  <div className="relative inline-block w-full text-left">
                    <Link
                      className="hover:opacity-75 lg:pl-5 lg:pr-5"
                      href="/dashboard"
                    >
                      Dashboard
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="relative inline-block w-full text-left">
                    <Link
                      className="hover:opacity-75 lg:pl-5 lg:pr-5"
                      href="/meetings"
                    >
                      Meetings
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="relative inline-block w-full text-left">
                    <Login />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
