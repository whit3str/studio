/**
 * @fileOverview Base de données locale de secours pour les descriptions de Pokémon.
 * Permet d'avoir des indices instantanés sans appeler l'IA pour les Pokémon communs.
 */

export interface LocalHint {
  en: string;
  fr: string;
}

export const LOCAL_POKEDEX_HINTS: Record<number, LocalHint> = {
  1: {
    en: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    fr: "Il y a une étrange graine plantée sur son dos depuis sa naissance. Elle grandit avec lui."
  },
  4: {
    en: "The flame on its tail indicates its health. If it's healthy, the flame burns brightly.",
    fr: "La flamme sur sa queue indique son état de santé. Elle brûle intensément s'il est en forme."
  },
  7: {
    en: "After birth, its back swells and hardens into a shell. Powerfully sprays bubbles from its mouth.",
    fr: "À sa naissance, son dos se gonfle et durcit pour former une carapace. Il crache de l'écume."
  },
  25: {
    en: "When several of these Pokémon gather, their electricity could build and cause lightning storms.",
    fr: "Quand plusieurs de ces Pokémon se réunissent, leur électricité peut provoquer des orages."
  },
  52: {
    en: "All it does is sleep and eat. It is so big that its belly can be used as a playground.",
    fr: "Il ne fait que manger et dormir. Il est si gros que son ventre peut servir d'aire de jeu."
  },
  133: {
    en: "An extremely rare Pokémon that may evolve in a number of different ways.",
    fr: "Un Pokémon très rare qui peut évoluer de plusieurs manières différentes."
  },
  143: {
    en: "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes even more slothful.",
    fr: "Très paresseux. Il ne fait que manger et dormir. Plus il grossit, plus il devient fainéant."
  },
  150: {
    en: "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.",
    fr: "Il a été créé par un scientifique après des années de manipulations génétiques."
  }
};

export function getLocalHint(id: number, lang: 'en' | 'fr'): string | null {
  return LOCAL_POKEDEX_HINTS[id]?.[lang] || null;
}
