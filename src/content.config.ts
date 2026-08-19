import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: z.object({
    order: z.number(),
    title: z.object({ ru: z.string(), uz: z.string() }),
    description: z.object({ ru: z.string(), uz: z.string() }),
    priceLabel: z.object({ ru: z.string(), uz: z.string() }),
    priceConfirmed: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    order: z.number(),
    question: z.object({ ru: z.string(), uz: z.string() }),
    answer: z.object({ ru: z.string(), uz: z.string() }),
    isTodo: z.boolean().default(false),
  }),
});

// Blog hozircha ishlatilmaydi, lekin struktura keyin kontent qo'shish uchun tayyor.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    locale: z.enum(['ru', 'uz']),
  }),
});

export const collections = { services, faq, blog };
