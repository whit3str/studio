'use server';
/**
 * @fileOverview Provides a contextual hint about a Pokémon without revealing the direct answer.
 *
 * - getAiHint - A function that generates a contextual hint for a given Pokémon.
 * - AiHintToolInput - The input type for the getAiHint function.
 * - AiHintToolOutput - The return type for the getAiHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHintToolInputSchema = z.object({
  pokemonName: z
    .string()
    .describe("The name of the Pokémon for which a hint is requested."),
  pokemonNumber: z
    .number()
    .int()
    .min(1)
    .max(151)
    .describe("The National Pokédex number of the Pokémon (1-151)."),
  language: z
    .enum(['en', 'fr'])
    .default('en')
    .describe("The language in which the hint should be provided."),
});
export type AiHintToolInput = z.infer<typeof AiHintToolInputSchema>;

const AiHintToolOutputSchema = z.object({
  hint: z
    .string()
    .describe(
      "A contextual hint about the Pokémon, such as its type, common habitat, or a distinct feature, without directly revealing its name or number."
    ),
});
export type AiHintToolOutput = z.infer<typeof AiHintToolOutputSchema>;

export async function getAiHint(
  input: AiHintToolInput
): Promise<AiHintToolOutput> {
  return aiHintToolFlow(input);
}

const aiHintToolPrompt = ai.definePrompt({
  name: 'aiHintToolPrompt',
  input: {schema: AiHintToolInputSchema},
  output: {schema: AiHintToolOutputSchema},
  prompt:
    "You are an expert Pokémon Professor. Your task is to provide a helpful, contextual hint about a specific Pokémon in the requested language ({{{language}}}). " +
    "The hint should guide the user towards the answer without directly giving away the Pokémon's name or its National Pokédex number. " +
    "Focus on aspects like its primary type, common habitat, distinctive physical features, or a well-known ability. " +
    "The Pokémon in question is related to number {{{pokemonNumber}}} and its name is {{{pokemonName}}}. " +
    "Provide only the hint in {{{language}}}, nothing else.",
});

const aiHintToolFlow = ai.defineFlow(
  {
    name: 'aiHintToolFlow',
    inputSchema: AiHintToolInputSchema,
    outputSchema: AiHintToolOutputSchema,
  },
  async input => {
    const {output} = await aiHintToolPrompt(input);
    return output!;
  }
);
