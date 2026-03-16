"use client";

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { PokeBall } from '@/components/PokeBall';
import { Brain, BookOpen, Trophy, Languages } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage, type Language } from '@/context/LanguageContext';

export default function Home() {
  const { lang, setLang } = useLanguage();

  const content = {
    en: {
      title: "PokéLearn Quest",
      subtitle: "Become a Kanto master. Learn the National Pokédex numbers for the first 151 Pokémon through interactive challenges.",
      studyTitle: "Kanto Region Study",
      studyDesc: "Browse and review all 151 Pokémon with images and numbers.",
      quizNumTitle: "Number Challenge",
      quizNumDesc: "What's their Pokédex number?",
      quizNameTitle: "Name Recall",
      quizNameDesc: "Which Pokémon is number X?",
      tipTitle: "Trainer Tip",
      tipDesc: '"Use the Study mode to memorize groups of 10. Once you\'re comfortable, try the quizzes to test your speed!"'
    },
    fr: {
      title: "PokéLearn Quest",
      subtitle: "Devenez un maître de Kanto. Apprenez les numéros du Pokédex National des 151 premiers Pokémon via des défis interactifs.",
      studyTitle: "Étude de Kanto",
      studyDesc: "Parcourez les 151 Pokémon avec images et numéros.",
      quizNumTitle: "Défi des Numéros",
      quizNumDesc: "Quel est leur numéro Pokédex ?",
      quizNameTitle: "Rappel des Noms",
      quizNameDesc: "Quel Pokémon porte le numéro X ?",
      tipTitle: "Conseil de Dresseur",
      tipDesc: '"Utilisez le mode Étude pour mémoriser par groupes de 10. Une fois à l\'aise, testez votre rapidité avec les quiz !"'
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen pb-24 md:pt-24 px-4 bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto space-y-8 py-8 text-center">
        <div className="flex justify-center mb-4">
          <Tabs value={lang} onValueChange={(val) => setLang(val as Language)} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en" className="gap-2">
                <Languages className="w-4 h-4" /> EN
              </TabsTrigger>
              <TabsTrigger value="fr" className="gap-2">
                <Languages className="w-4 h-4" /> FR
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          <PokeBall className="w-24 h-24 mx-auto text-primary animate-bounce-subtle" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <Link href="/study" className="group">
            <Card className="h-full border-2 border-transparent hover:border-primary transition-all hover:shadow-xl">
              <CardContent className="flex flex-col items-center p-8 space-y-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">{t.studyTitle}</h2>
                <p className="text-muted-foreground">{t.studyDesc}</p>
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
                    <h2 className="text-xl font-bold">{t.quizNumTitle}</h2>
                    <p className="text-sm text-muted-foreground">{t.quizNumDesc}</p>
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
                    <h2 className="text-xl font-bold">{t.quizNameTitle}</h2>
                    <p className="text-sm text-muted-foreground">{t.quizNameDesc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="bg-white/50 border rounded-2xl p-6 mt-8">
          <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t.tipTitle}
          </h3>
          <p className="text-sm text-muted-foreground italic">
            {t.tipDesc}
          </p>
        </div>
      </main>
    </div>
  );
}
