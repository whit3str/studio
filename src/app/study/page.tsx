"use client";

import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { POKEMON_151, getPokemonImageUrl } from '@/lib/pokemon-data';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter } from 'lucide-react';

const TYPES = [
  "all", "normal", "fire", "water", "grass", "electric", "ice", "fighting", 
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "steel", "fairy"
];

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-600",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-700",
  steel: "bg-slate-400",
  fairy: "bg-rose-300",
};

export default function StudyPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredPokemon = useMemo(() => {
    return POKEMON_151.filter(p => {
      const matchesSearch = p.name[lang].toLowerCase().includes(search.toLowerCase()) || 
                           p.id.toString().includes(search);
      const matchesType = selectedType === "all" || p.types.includes(selectedType);
      return matchesSearch && matchesType;
    });
  }, [search, selectedType, lang]);

  return (
    <div className="min-h-screen pb-24 md:pt-24 px-4 bg-background">
      <Navigation />
      
      <main className="max-w-6xl mx-auto py-8">
        <header className="mb-8 space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {lang === 'fr' ? "Étude de la Région Kanto" : "Kanto Region Study"}
            </h1>
            <p className="text-muted-foreground">
              {lang === 'fr' ? "Utilisez les filtres pour réviser par types ou par noms." : "Use filters to review by types or names."}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={lang === 'fr' ? "Rechercher un Pokémon..." : "Search Pokémon..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[180px] h-11">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {filteredPokemon.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredPokemon.map((pokemon) => {
              const id = pokemon.id;
              const name = pokemon.name[lang];
              return (
                <Card key={id} className="overflow-hidden group hover:scale-105 transition-transform duration-200 border-2 hover:border-primary/50">
                  <div className="bg-muted p-4 relative aspect-square flex items-center justify-center overflow-hidden">
                    <Image
                      src={getPokemonImageUrl(id)}
                      alt={name}
                      width={96}
                      height={96}
                      className="pixel-art relative z-10 group-hover:scale-110 transition-transform"
                      data-ai-hint="pokemon sprite"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground bg-white/80 px-1.5 rounded z-20">
                      #{id.toString().padStart(3, '0')}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-3 text-center space-y-2">
                    <p className="font-bold text-sm truncate">{name}</p>
                    <div className="flex justify-center gap-1 flex-wrap">
                      {pokemon.types.map(type => (
                        <Badge key={type} className={`${TYPE_COLORS[type]} text-[9px] h-4 px-1 capitalize border-none`}>
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground text-lg">
              {lang === 'fr' ? "Aucun Pokémon ne correspond à votre recherche." : "No Pokémon match your search."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
