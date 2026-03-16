"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { POKEMON_151, getPokemonImageUrl } from '@/lib/pokemon-data';
import { getAiHint } from '@/ai/flows/ai-hint-tool-flow';
import { getLocalHint } from '@/lib/local-pokedex';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, HelpCircle, ArrowRight, RefreshCw, Trophy, Brain, ShieldAlert, ShieldCheck, Shield, Eye } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLanguage, type Language } from '@/context/LanguageContext';

type QuizType = 'number' | 'name';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizViewProps {
  type: QuizType;
}

export function QuizView({ type }: QuizViewProps) {
  const { lang } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastWrongInput, setLastWrongInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showAnswer, setShowAnswer] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHint = useCallback(async (idx: number, currentLang: Language) => {
    if (idx === -1) return;

    const pokemonId = idx + 1;
    
    const localHint = getLocalHint(pokemonId, currentLang);
    if (localHint) {
      setHint(localHint);
      return;
    }

    const cacheKey = `pokedex-cache-${pokemonId}-${currentLang}`;
    const cachedHint = localStorage.getItem(cacheKey);
    if (cachedHint) {
      setHint(cachedHint);
      return;
    }

    setIsHintLoading(true);
    try {
      const response = await getAiHint({
        pokemonName: POKEMON_151[idx].name[currentLang],
        pokemonNumber: pokemonId,
        language: currentLang
      });
      setHint(response.hint);
      localStorage.setItem(cacheKey, response.hint);
    } catch (error) {
      setHint(currentLang === 'fr' ? "Le Professeur Chen est occupé..." : "Professor Oak is busy right now...");
    } finally {
      setIsHintLoading(false);
    }
  }, []);

  const generateNext = useCallback(() => {
    let nextIdx: number;
    const availableIndices = Array.from({ length: 151 }, (_, i) => i).filter(i => !usedIndices.includes(i));
    
    if (availableIndices.length === 0) {
      nextIdx = Math.floor(Math.random() * 151);
      setUsedIndices([nextIdx]);
    } else {
      const randomIdx = Math.floor(Math.random() * availableIndices.length);
      nextIdx = availableIndices[randomIdx];
      setUsedIndices(prev => [...prev, nextIdx]);
    }

    setCurrentIdx(nextIdx);
    setUserInput('');
    setSuggestions([]);
    setLastWrongInput('');
    setIsCorrect(null);
    setHint(null);
    setAttempts(0);
    setShowAnswer(false);
  }, [usedIndices]);

  useEffect(() => {
    if (currentIdx === -1) {
      generateNext();
    }
  }, [currentIdx, generateNext]);

  useEffect(() => {
    if (difficulty === 'medium' && currentIdx !== -1 && !hint && !quizFinished) {
      handleHint(currentIdx, lang);
    }
  }, [difficulty, currentIdx, lang, hint, quizFinished, handleHint]);

  // Handle Suggestions
  useEffect(() => {
    if (type === 'name' && userInput.length >= 2 && !isCorrect && !showAnswer) {
      const query = userInput.toLowerCase();
      const matches = POKEMON_151
        .map(p => p.name[lang])
        .filter(name => 
          name.toLowerCase().includes(query) && 
          name.toLowerCase() !== query
        )
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [userInput, lang, type, isCorrect, showAnswer]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCorrect === true || quizFinished || showAnswer || !userInput.trim()) return;

    const answer = userInput.trim().toLowerCase();
    const pokemon = POKEMON_151[currentIdx];
    const pokemonNumber = (currentIdx + 1).toString();

    let correct = false;
    if (type === 'number') {
      correct = answer === pokemonNumber;
    } else {
      const normalizedOfficial = pokemon.name[lang].toLowerCase().replace(/[♀♂]/g, '').trim();
      
      if (pokemon.id === 29) { // Nidoran F
        correct = answer === normalizedOfficial || answer === "nidoran f" || answer === "nidoran femelle" || answer === "nidoran female" || answer === "nidoran♀";
      } else if (pokemon.id === 32) { // Nidoran M
        correct = answer === normalizedOfficial || answer === "nidoran m" || answer === "nidoran male" || answer === "nidoran♂";
      } else {
        correct = answer === pokemon.name[lang].toLowerCase();
      }
    }

    if (correct) {
      setIsCorrect(true);
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      setSuggestions([]);
    } else {
      setLastWrongInput(userInput.trim());
      setIsCorrect(false);
      setAttempts(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (score.total >= 9) {
      setQuizFinished(true);
    } else {
      generateNext();
    }
  };

  const handleReveal = () => {
    setShowAnswer(true);
    setIsCorrect(false);
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
  };

  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 });
    setUsedIndices([]);
    setQuizFinished(false);
    setCurrentIdx(-1);
  };

  if (currentIdx === -1) return null;

  if (quizFinished) {
    const percentage = Math.round((score.correct / 10) * 100);
    return (
      <Card className="max-w-xl mx-auto overflow-hidden shadow-2xl">
        <CardHeader className="text-center bg-primary text-primary-foreground py-10">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16" />
          </div>
          <CardTitle className="text-3xl">{lang === 'fr' ? "Quiz Terminé !" : "Quiz Complete!"}</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            {lang === 'fr' ? "Vous avez terminé votre session de 10 Pokémon." : "You've completed your 10-Pokémon session."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-xl">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{lang === 'fr' ? "Correct" : "Correct"}</p>
              <p className="text-4xl font-bold text-primary">{score.correct}</p>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{lang === 'fr' ? "Précision" : "Accuracy"}</p>
              <p className="text-4xl font-bold text-accent">{percentage}%</p>
            </div>
          </div>
          
          <Button onClick={resetQuiz} size="lg" className="w-full gap-2 text-lg">
            <RefreshCw className="w-5 h-5" /> {lang === 'fr' ? "Rejouer" : "Play Again"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPokemonNumber = currentIdx + 1;
  const currentPokemon = POKEMON_151[currentIdx];

  return (
    <div className="max-w-xl mx-auto space-y-6" ref={containerRef}>
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>{lang === 'fr' ? "Progression" : "Progress"}</span>
              <span>{score.total + 1} / 10</span>
            </div>
            <Progress value={((score.total + 1) / 10) * 100} className="h-3" />
          </div>
        </div>

        <Tabs value={difficulty} onValueChange={(val) => setDifficulty(val as Difficulty)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="easy" className="gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="hidden sm:inline">{lang === 'fr' ? "Facile" : "Easy"}</span>
            </TabsTrigger>
            <TabsTrigger value="medium" className="gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">{lang === 'fr' ? "Moyen" : "Medium"}</span>
            </TabsTrigger>
            <TabsTrigger value="hard" className="gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">{lang === 'fr' ? "Difficile" : "Hard"}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className={cn(
        "overflow-hidden transition-all duration-300 border-2",
        isCorrect === true ? "border-green-500 shadow-green-100" : 
        (isCorrect === false && !showAnswer) ? "border-destructive shadow-destructive/10 animate-shake" : 
        showAnswer ? "border-orange-400" : "border-transparent"
      )}>
        <CardHeader className="text-center bg-muted/30 pb-2">
          <CardTitle className="text-2xl mb-1">
            {type === 'number' 
              ? (lang === 'fr' ? "Quel est ce numéro ?" : "What's the number?") 
              : (lang === 'fr' ? "Quel est ce Pokémon ?" : "Who's this Pokémon?")}
          </CardTitle>
          <div className="flex flex-col items-center">
             <span className="text-4xl md:text-5xl font-mono font-black text-primary/80 tracking-tighter py-2">
                #{currentPokemonNumber.toString().padStart(3, '0')}
             </span>
             {type === 'name' && (
               <CardDescription className="text-xs uppercase tracking-widest">
                 {lang === 'fr' ? "Identification Kanto" : "Kanto Identification"}
               </CardDescription>
             )}
          </div>
        </CardHeader>
        
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <div className="relative w-48 h-48 bg-muted rounded-full flex items-center justify-center border-4 border-white shadow-inner group overflow-hidden">
            {(type === 'number' || difficulty === 'easy' || isCorrect === true || showAnswer) ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                  src={getPokemonImageUrl(currentPokemonNumber, isCorrect === true || showAnswer)}
                  alt="Pokemon Challenge"
                  width={160}
                  height={160}
                  className={cn(
                    "drop-shadow-xl transition-all duration-500 pixel-art",
                    (difficulty === 'easy' && isCorrect !== true && !showAnswer && type === 'name') ? "brightness-0" : "brightness-100"
                  )}
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-6xl font-bold text-primary/20">
                ?
              </div>
            )}
            
            {isCorrect === true && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/5 pointer-events-none rounded-full">
                <Sparkles className="w-24 h-24 text-green-500/40 animate-pulse" />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="flex gap-2 relative">
              <div className="flex-1 relative">
                <Input
                  type={type === 'number' ? 'number' : 'text'}
                  placeholder={type === 'number' 
                    ? (lang === 'fr' ? 'Ex: 25' : 'Ex: 25') 
                    : (lang === 'fr' ? 'Nom du Pokémon' : 'Pokémon Name')}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isCorrect === true || showAnswer}
                  className="text-lg h-12 text-center"
                  autoFocus
                />
                
                {/* Autocomplete suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors text-sm font-medium border-b last:border-0"
                        onClick={() => {
                          setUserInput(s);
                          setSuggestions([]);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isCorrect && !showAnswer && (
                <Button type="submit" size="lg" className="px-6 font-bold h-12">
                  OK
                </Button>
              )}
            </div>

            {isCorrect === true && (
              <div className="text-center space-y-4 animate-in slide-in-from-top-4 duration-300">
                <p className="text-xl font-bold text-green-600 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" /> {lang === 'fr' ? "Correct ! C'est" : "Correct! That's"} {currentPokemon.name[lang]}!
                </p>
                <Button onClick={handleNext} variant="secondary" className="w-full gap-2 font-bold py-6">
                  {lang === 'fr' ? "Pokémon Suivant" : "Next Pokémon"} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {showAnswer && (
              <div className="text-center space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                   <p className="text-sm text-orange-600 font-medium mb-1">{lang === 'fr' ? "La réponse était :" : "The answer was:"}</p>
                   <p className="text-2xl font-black text-orange-700">{type === 'number' ? currentPokemonNumber : currentPokemon.name[lang]}</p>
                </div>
                <Button onClick={handleNext} variant="outline" className="w-full gap-2 border-orange-300 text-orange-700 hover:bg-orange-50 py-6 font-bold">
                  {lang === 'fr' ? "Continuer" : "Continue"} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {isCorrect === false && !showAnswer && (
              <div className="text-center space-y-1 animate-in fade-in duration-200">
                <p className="text-destructive font-bold text-lg">
                  "{lastWrongInput}" {lang === 'fr' ? "n'est pas la bonne réponse." : "is not the right answer."}
                </p>
                <p className="text-muted-foreground text-sm">
                  {lang === 'fr' ? "Réessayez !" : "Try again!"}
                </p>
              </div>
            )}
          </form>

          <div className="w-full pt-4 border-t space-y-4">
            {!hint && !isCorrect && !showAnswer && difficulty !== 'hard' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full gap-2 text-muted-foreground hover:text-primary"
                onClick={() => handleHint(currentIdx, lang)}
                disabled={isHintLoading}
              >
                {isHintLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <HelpCircle className="w-4 h-4" />
                )}
                {lang === 'fr' ? "Besoin d'un indice ?" : "Need a hint?"}
              </Button>
            )}

            {hint && !showAnswer && difficulty !== 'hard' && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 animate-in slide-in-from-bottom-2 duration-300">
                <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1 flex items-center gap-2">
                  <Brain className="w-3 h-3" /> {lang === 'fr' ? "Indice du Professeur" : "Professor's Hint"}
                </p>
                <p className="text-sm italic text-foreground leading-relaxed">{hint}</p>
              </div>
            )}

            {!isCorrect && !showAnswer && (
              <Button 
                variant="link" 
                className="w-full text-xs text-muted-foreground gap-1"
                onClick={handleReveal}
              >
                <Eye className="w-3 h-3" />
                {lang === 'fr' ? "Révéler la réponse" : "Reveal answer"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-8 text-sm font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          {lang === 'fr' ? "Réussis :" : "Success:"} {score.correct}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          {lang === 'fr' ? "Total :" : "Total:"} {score.total}
        </div>
      </div>
    </div>
  );
}
