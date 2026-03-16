import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { PokeBall } from '@/components/PokeBall';
import { Brain, BookOpen, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen pb-24 md:pt-24 px-4 bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto space-y-8 py-8 text-center">
        <div className="space-y-4">
          <PokeBall className="w-24 h-24 mx-auto text-primary animate-bounce-subtle" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
            PokéLearn Quest
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Become a Kanto master. Learn the National Pokédex numbers for the first 151 Pokémon through interactive challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <Link href="/study" className="group">
            <Card className="h-full border-2 border-transparent hover:border-primary transition-all hover:shadow-xl">
              <CardContent className="flex flex-col items-center p-8 space-y-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Kanto Region Study</h2>
                <p className="text-muted-foreground">Browse and review all 151 Pokémon with images and numbers.</p>
              </CardContent>
            </Card>
          </Link>

          <div className="grid grid-cols-1 gap-4">
            <Link href="/quiz/number" className="group">
              <Card className="border-2 border-transparent hover:border-primary transition-all hover:shadow-xl">
                <CardContent className="flex items-center p-6 space-y-0 gap-6">
                  <div className="p-3 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">Number Challenge</h2>
                    <p className="text-sm text-muted-foreground">What's their Pokédex number?</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/quiz/name" className="group">
              <Card className="border-2 border-transparent hover:border-primary transition-all hover:shadow-xl">
                <CardContent className="flex items-center p-6 space-y-0 gap-6">
                  <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">Name Recall</h2>
                    <p className="text-sm text-muted-foreground">Which Pokémon is number X?</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="bg-white/50 border rounded-2xl p-6 mt-8">
          <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Trainer Tip
          </h3>
          <p className="text-sm text-muted-foreground italic">
            "Use the Study mode to memorize groups of 10. Once you're comfortable, try the quizzes to test your speed!"
          </p>
        </div>
      </main>
    </div>
  );
}
