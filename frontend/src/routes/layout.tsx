import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <section className="h-screen w-full bg-linear-to-t from-green-1 to-green-2 flex flex-col justify-between">

      <nav className="w-full flex justify-between px-12 py-2">
        <div className="flex items-center gap-2">
          <figure>
            <img src="/Logo.svg" alt="wShare Logo" className="size-7" />
          </figure>
          <span className="font-imb-400 text-gray-300 ">wShare</span>
        </div>
        <div className="flex gap-4 font-imb-400 text-gray-300">
          <button disabled>Login</button>
          <button disabled className="bg-green-1 px-2 py-0.5 rounded-md">Register</button>
        </div>
      </nav>

      <main className="flex items-center justify-center relative">
        <Outlet />
      </main>

      <footer className="w-full flex justify-between px-12 py-2">
        <div className="font-imb-400 text-gray-1">
          <span>wShare | </span>
          <a
            href='https://winkermind.com/'
            className="hover:text-green-400"
            target="_blank"
            rel="noopener noreferrer"
          >winkermind©
          </a>
          <span> 2026</span>
        </div>
        <div className="flex gap-4 font-imb-400 text-gray-1">
          <a className="rounded-full bg-green-4 size-8 flex items-center justify-center cursor-pointer hover:bg-green-500"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/winkermind/"
          >
            <img src="/ig.png" alt="Instagram Logo" className="size-5" />
          </a>
          <a className="rounded-full bg-green-4 size-8 flex items-center justify-center cursor-pointer hover:bg-green-500"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/winkermind"
          >
            <img src="/fb.png" alt="Facebook Logo" className="size-5" />
          </a>
          <a className="rounded-full bg-green-4 size-8 flex items-center justify-center cursor-pointer hover:bg-green-500 text-black"
            target="_blank"
            rel="noopener noreferrer"
            href="https://whatsapp.com/channel/0029Va4on5GJJhzfsxIren2m"
          >
            WA
          </a>
        </div>
      </footer>
    </section>
  )
}