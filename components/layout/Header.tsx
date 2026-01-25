'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, Mountain, Search, Heart, User, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurrencyToggle } from '@/components/ui/CurrencyToggle';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navigation = [
  { name: 'Comprar', href: '/properties?type=sale' },
  { name: 'Alquilar', href: '/properties?type=rent' },
  { name: 'Anticrético', href: '/properties?type=anticretico' },
  { name: 'Buscar', href: '/search' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo - La Paz Skyline */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Mountain className="h-8 w-8 text-primary-600" />
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-px">
              <div className="w-1 h-2 bg-primary-400 rounded-t-sm" />
              <div className="w-1 h-3 bg-primary-500 rounded-t-sm" />
              <div className="w-1 h-2.5 bg-primary-400 rounded-t-sm" />
            </div>
          </div>
          <span className="text-xl font-bold text-gray-900">Casa<span className="text-primary-600">LaPaz</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-600',
                pathname === item.href ? 'text-primary-600' : 'text-gray-600'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <CurrencyToggle variant="buttons" />
          {user ? (
            <>
              <Link
                href="/properties/new"
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Publicar
              </Link>
              <Link href="/favorites" className="p-2 text-gray-600 hover:text-primary-600">
                <Heart className="h-5 w-5" />
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <User className="h-4 w-4" />
                  Mi Cuenta
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Panel de Control
                  </Link>
                  <Link
                    href="/dashboard/properties"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Mis Propiedades
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Configuración
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-primary-600"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="my-4" />
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-gray-500">Moneda</span>
              <CurrencyToggle variant="buttons" />
            </div>
            <hr className="my-2" />
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Panel de Control
                </Link>
                <Link
                  href="/properties/new"
                  className="block rounded-lg px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Publicar Propiedad
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/signup"
                  className="block rounded-lg bg-primary-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
