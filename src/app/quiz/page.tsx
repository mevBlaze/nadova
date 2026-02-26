'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Zap, Shield, Heart, Moon, Dumbbell, ShieldCheck, CheckCircle } from 'lucide-react';

const goals = [
  { id: 'weight', label: 'Weight Management', icon: Zap, color: '#f97316', description: 'Fat loss & metabolism' },
  { id: 'aging', label: 'Anti-Aging', icon: Shield, color: '#a855f7', description: 'Longevity & cellular health' },
  { id: 'recovery', label: 'Recovery & Healing', icon: Heart, color: '#22c55e', description: 'Tissue repair & injury' },
  { id: 'sleep', label: 'Sleep Quality', icon: Moon, color: '#6366f1', description: 'Rest & restoration' },
  { id: 'muscle', label: 'Muscle & Performance', icon: Dumbbell, color: '#ef4444', description: 'Strength & endurance' },
  { id: 'immunity', label: 'Immune Support', icon: ShieldCheck, color: '#3b82f6', description: 'Defense & wellness' },
];

const experienceLevels = [
  { id: 'new', label: 'New to Peptides', description: 'Looking for guidance and education' },
  { id: 'intermediate', label: 'Some Experience', description: 'Familiar with basic compounds' },
  { id: 'advanced', label: 'Experienced Researcher', description: 'Deep knowledge of peptide research' },
];

const recommendations: Record<string, { name: string; tagline: string; reason: string }[]> = {
  weight: [
    { name: '5-Amino-1MQ', tagline: 'Metabolic Optimizer', reason: 'Targets fat metabolism at the cellular level' },
    { name: 'MOTS-c', tagline: 'Mitochondrial Peptide', reason: 'Enhances metabolic function and exercise capacity' },
    { name: 'Tesamorelin', tagline: 'GH Releasing Hormone', reason: 'Promotes fat reduction and metabolic health' },
  ],
  aging: [
    { name: 'SS-31 (Elamipretide)', tagline: 'Mitochondrial Protector', reason: 'Protects cells from age-related damage' },
    { name: 'Epitalon', tagline: 'Telomerase Activator', reason: 'Supports cellular longevity mechanisms' },
    { name: 'GHK-Cu', tagline: 'Copper Peptide Complex', reason: 'Promotes tissue regeneration and repair' },
  ],
  recovery: [
    { name: 'BPC-157', tagline: 'Body Protection Compound', reason: 'Accelerates healing and tissue repair' },
    { name: 'TB-500', tagline: 'Thymosin Beta-4 Fragment', reason: 'Supports injury recovery and flexibility' },
  ],
  sleep: [
    { name: 'DSIP', tagline: 'Delta Sleep-Inducing Peptide', reason: 'Promotes deep, restorative sleep' },
    { name: 'Epitalon', tagline: 'Telomerase Activator', reason: 'Regulates circadian rhythm' },
  ],
  muscle: [
    { name: 'Tesamorelin', tagline: 'GH Releasing Hormone', reason: 'Supports muscle development and recovery' },
    { name: 'BPC-157', tagline: 'Body Protection Compound', reason: 'Aids muscle repair and reduces inflammation' },
  ],
  immunity: [
    { name: 'Thymosin Alpha-1', tagline: 'Immune Modulator', reason: 'Enhances immune system function' },
    { name: 'LL-37', tagline: 'Antimicrobial Peptide', reason: 'Natural defense against pathogens' },
  ],
};

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const getRecommendations = () => {
    if (!selectedGoal) return [];
    return recommendations[selectedGoal] || [];
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-3">
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Goals */}
          {step === 0 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-4">
                What's your primary health goal?
              </h1>
              <p className="text-[var(--color-text-muted)] mb-8">
                Select the goal that matters most to you right now.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]'
                          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: goal.color }} />
                      </div>
                      <div>
                        <div className="font-semibold mb-0.5">{goal.label}</div>
                        <div className="text-sm text-[var(--color-text-muted)]">{goal.description}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-[var(--color-accent)] ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleNext}
                disabled={!selectedGoal}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Experience */}
          {step === 1 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-4">
                What's your experience level?
              </h1>
              <p className="text-[var(--color-text-muted)] mb-8">
                This helps us tailor our recommendations to your needs.
              </p>
              <div className="space-y-4 mb-10">
                {experienceLevels.map((level) => {
                  const isSelected = selectedExperience === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedExperience(level.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]'
                          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold mb-0.5">{level.label}</div>
                        <div className="text-sm text-[var(--color-text-muted)]">{level.description}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-[var(--color-accent)]" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4">
                <button onClick={handleBack} className="btn btn-secondary">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedExperience}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  See Results
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 2 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <div className="inline-flex w-16 h-16 rounded-full bg-[var(--color-accent)]/10 items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-4">
                  Your Personalized Recommendations
                </h1>
                <p className="text-[var(--color-text-muted)]">
                  Based on your goals, here are the compounds we recommend for your research.
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {getRecommendations().map((product, i) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-xl font-bold">{product.name}</h3>
                        <p className="text-sm text-[var(--color-accent)]">{product.tagline}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-medium">
                        #{i + 1} Pick
                      </span>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm">{product.reason}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setStep(0)} className="btn btn-secondary flex-1">
                  <ArrowLeft className="w-4 h-4" />
                  Retake Quiz
                </button>
                <Link href="/products" className="btn btn-primary flex-1">
                  View All Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
