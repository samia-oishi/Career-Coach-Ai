import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { Career } from '../../types.js';

const fallbackResumeSummary = (skills: string[], experience: string, careerGoal: string) => ({
  headline: `${careerGoal} candidate with strengths in ${skills.slice(0, 3).join(', ')}`,
  summary: `Motivated technology professional with hands-on experience in ${skills.join(', ')}. ${experience} Focused on growing into ${careerGoal} by applying practical problem-solving, continuous learning, and clear communication to deliver reliable business outcomes.`,
  keyStrengths: skills.slice(0, 5),
  improvementTips: [
    'Add measurable outcomes such as performance improvements, revenue impact, or time saved.',
    'Match the summary wording to the target role and job description.',
    'Keep the final resume summary between three and five concise sentences.',
  ],
});

export const generateWithGemini = async (prompt: string) => {
  if (!env.GEMINI_API_KEY) {
    throw new AppError(503, 'AI_NOT_CONFIGURED', 'AI service is not configured yet. Add a Gemini API key to enable this feature.');
  }

  const response = await fetch(`${env.GEMINI_API_URL}/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1200 },
    }),
  });

  if (!response.ok) {
    throw new AppError(503, 'AI_PROVIDER_ERROR', 'AI service is temporarily unavailable. Please try again later.');
  }

  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim();

  if (!text) {
    throw new AppError(503, 'AI_EMPTY_RESPONSE', 'AI service returned an empty response. Please try again.');
  }

  return text;
};

const parseJsonFromText = <T>(text: string): T => {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned) as T;
};

export const createResumeSummary = async (input: { skills: string[]; experience: string; careerGoal: string }) => {
  const prompt = `You are CareerCoach Ai, a professional career coach. Generate a truthful resume summary. Do not invent employers, degrees, certifications, dates, metrics, or years of experience. Return JSON only with keys: headline, summary, keyStrengths, improvementTips.

Skills: ${input.skills.join(', ')}
Experience: ${input.experience}
Career goal: ${input.careerGoal}`;

  try {
    const text = await generateWithGemini(prompt);
    return parseJsonFromText<ReturnType<typeof fallbackResumeSummary>>(text);
  } catch {
    return fallbackResumeSummary(input.skills, input.experience, input.careerGoal);
  }
};

export const createCareerRecommendations = async (
  input: { skills: string[]; interests: string[]; experienceLevel: string },
  careers: Pick<Career, 'slug' | 'title' | 'category' | 'description' | 'requiredSkills' | 'difficulty' | 'demandScore'>[]
) => {
  const compactCareers = careers.map((career) => ({
    slug: career.slug,
    title: career.title,
    category: career.category,
    difficulty: career.difficulty,
    demandScore: career.demandScore,
    skills: career.requiredSkills.slice(0, 6),
    description: career.description,
  }));

  const prompt = `You are CareerCoach Ai. Recommend the best technology careers from the provided catalog only. Do not invent career slugs. Return JSON only with key recommendations. Each recommendation must include slug, title, matchScore, explanation, skillsToImprove, nextSteps.

User skills: ${input.skills.join(', ')}
User interests: ${input.interests.join(', ')}
Experience level: ${input.experienceLevel}
Career catalog JSON: ${JSON.stringify(compactCareers)}`;

  try {
    const text = await generateWithGemini(prompt);
    return parseJsonFromText<{ recommendations: Array<Record<string, unknown>> }>(text);
  } catch {
    const scored = careers
      .map((career) => {
        const overlap = career.requiredSkills.filter((skill) => input.skills.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase())).length;
        return { career, score: overlap * 15 + career.demandScore / 4 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return {
      recommendations: scored.map(({ career, score }) => ({
        slug: career.slug,
        title: career.title,
        matchScore: Math.min(95, Math.round(score)),
        explanation: `${career.title} aligns with your current skills and interest profile while offering strong demand in ${career.category}.`,
        skillsToImprove: career.requiredSkills.filter((skill) => !input.skills.includes(skill)).slice(0, 4),
        nextSteps: [`Build a portfolio project related to ${career.title}.`, 'Save this career and compare its learning path with your weekly schedule.'],
      })),
    };
  }
};
