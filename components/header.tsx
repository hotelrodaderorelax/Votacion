"use client"

import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M20 5C20 5 22 8 22 12C22 16 20 18 20 18C20 18 18 16 18 12C18 8 20 5 20 5Z"
                fill="currentColor"
              />
              <path
                d="M20 18C20 18 26 14 30 16C34 18 35 22 35 22C35 22 31 20 27 20C23 20 20 22 20 22V18Z"
                fill="currentColor"
              />
              <path
                d="M20 18C20 18 14 14 10 16C6 18 5 22 5 22C5 22 9 20 13 20C17 20 20 22 20 22V18Z"
                fill="currentColor"
              />
              <path
                d="M20 22V35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
                Rodadero Relax
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Hotel
              </span>
            </div>
          </div>
        </Link>
        
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href="#votar" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Votar
          </Link>
          <Link 
            href="/admin" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Administrador
          </Link>
        </nav>
      </div>
    </header>
  )
}
