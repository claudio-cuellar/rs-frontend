'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({ propertyId, className, showText = true }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsFavorited(!!data);
      setLoading(false);
    };

    checkFavorite();
  }, [propertyId, supabase]);

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to login
      window.location.href = `/login?redirect=/properties/${propertyId}`;
      return;
    }

    setToggling(true);

    if (isFavorited) {
      // Remove from favorites
      await supabase
        .from('favorites')
        .delete()
        .eq('property_id', propertyId)
        .eq('user_id', user.id);
      setIsFavorited(false);
    } else {
      // Add to favorites
      await supabase
        .from('favorites')
        .insert({
          property_id: propertyId,
          user_id: user.id,
        } as any);
      setIsFavorited(true);
    }

    setToggling(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading || toggling}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
        isFavorited
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50',
        className
      )}
    >
      {toggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
      )}
      {showText && (isFavorited ? 'Saved' : 'Save')}
    </button>
  );
}
