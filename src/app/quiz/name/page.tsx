import { Navigation } from '@/components/Navigation';
import { QuizView } from '@/components/QuizView';

export default function NameQuizPage() {
  return (
    <div className="min-h-screen pb-24 md:pt-24 px-4 bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8">
        <QuizView type="name" />
      </main>
    </div>
  );
}
