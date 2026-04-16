import { z } from "zod";

const Dates = z.object({
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive().optional(),
});

const File = Dates.extend({
  filename: z.string(),
  content: z.string(),
});

const Comment = Dates.extend({
  content: z.string(),
});

const Gist = Dates.extend({
  id: z.number().readonly(),
  title: z.string(),
  description: z.string().optional(),
  slug: z.string().readonly(),
  files: z.array(File).min(1),
  filesCount: z.number().int().default(0),
  comments: z.array(Comment).optional(),
  commentsCount: z.number().int().default(0),
});

const GistInfo = Gist.omit({
  id: true,
  comments: true,
}).extend({
  files: z.array(File).length(1),
});

const GistSubmission = Gist.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  filesCount: true,
  comments: true,
  commentsCount: true,
});
