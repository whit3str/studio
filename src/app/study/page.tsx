import { Navigation } from '@/components/Navigation';
import { POKEMON_151, getPokemonImageUrl } from '@/lib/pokemon-data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function StudyPage() {
  return (
    <div className="min-h-screen pb-24 md:pt-24 px-4 bg-background">
      <Navigation />
      
      <main className="max-w-6xl mx-auto py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Kanto Region Study</h1>
          <p className="text-muted-foreground">Browse all 151 Pokémon and learn their numbers.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {POKEMON_151.map((name, index) => {
            const id = index + 1;
            return (
              <Card key={id} className="overflow-hidden group hover:scale-105 transition-transform duration-200">
                <div className="bg-muted p-4 relative aspect-square flex items-center justify-center">
                  <Image
                    src={getPokemonImageUrl(id)}
                    alt={name}
                    width={96}
                    height={96}
                    className="pixel-art"
                    data-ai-hint="pokemon sprite"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground bg-white/80 px-1.5 rounded">
                    #{id.toString().padStart(3, '0')}
                  </span>
                </div>
                <CardContent className="p-3 text-center">
                  <p className="font-bold text-sm truncate">{name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
