import Link from 'next/link';
import { Mountain, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  propiedades: [
    { name: 'Comprar', href: '/properties?type=sale' },
    { name: 'Alquilar', href: '/properties?type=rent' },
    { name: 'Anticrético', href: '/properties?type=anticretico' },
    { name: 'Publicar', href: '/properties/new' },
  ],
  barrios: [
    { name: 'Sopocachi', href: '/search?neighborhood=Sopocachi' },
    { name: 'Calacoto', href: '/search?neighborhood=Calacoto' },
    { name: 'San Miguel', href: '/search?neighborhood=San Miguel' },
    { name: 'Achumani', href: '/search?neighborhood=Achumani' },
    { name: 'Miraflores', href: '/search?neighborhood=Miraflores' },
  ],
  empresa: [
    { name: 'Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Ayuda', href: '/help' },
  ],
  legal: [
    { name: 'Privacidad', href: '/privacy' },
    { name: 'Términos', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <Mountain className="h-8 w-8 text-primary-400" />
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-px">
                  <div className="w-1 h-2 bg-primary-300 rounded-t-sm" />
                  <div className="w-1 h-3 bg-primary-400 rounded-t-sm" />
                  <div className="w-1 h-2.5 bg-primary-300 rounded-t-sm" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">Casa<span className="text-primary-400">LaPaz</span></span>
            </Link>
            <p className="mt-4 text-sm">
              El portal inmobiliario más completo de La Paz, Bolivia. 
              Encuentra tu hogar ideal.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>La Paz, Bolivia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>+591 2 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>info@casalapaz.bo</span>
              </div>
            </div>
          </div>

          {/* Propiedades */}
          <div>
            <h3 className="font-semibold text-white">Propiedades</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.propiedades.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Barrios */}
          <div>
            <h3 className="font-semibold text-white">Barrios Populares</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.barrios.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-white">Empresa</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} CasaLaPaz. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
