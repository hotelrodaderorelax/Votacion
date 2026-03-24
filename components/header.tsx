"use client"

import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center gap-3">
            {/* 1. Tu Logo Real */}
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#f5ac0a] shadow-md transition-transform group-hover:scale-105">
              <Image
                src="Logo.jpg"
                alt="Logo Rodadero Relax"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex flex-col">
              {/* 2. Nombre con tu Azul Corporativo */}
              <span className="font-serif text-2xl font-black tracking-tight text-[#2878a8]">
                Rodadero Relax
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f5ac0a]">
                Hotel
              </span>
            </div>
          </div>
        </Link>
        
        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            href="#votar" 
            className="text-sm font-bold uppercase tracking-wider text-slate-600 transition-colors hover:text-[#2878a8]"
          >
            Votar
          </Link>
          {/* Botón de Administrador con tu Naranja */}
          <Link 
            href="/admin" 
            className="rounded-full bg-[#f5ac0a] px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#d49408] hover:shadow-lg active:scale-95"
          >
            Administrador
          </Link>
        </nav>
      </div>
    </header>
  )
}
