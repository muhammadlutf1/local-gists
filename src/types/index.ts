import type { Comment as C, Gist as G, File as F } from "../prisma/client.ts";

export type File = F;

export type FileSubmission = Pick<File, "filename"> &
  Partial<Pick<File, "content">>;

export type Gist = G & {
  files: File[];
  comments: Comment[];
};

export type GistSubmission = Pick<Gist, "title"> & {
  files: FileSubmission[];
} & Partial<Pick<Gist, "description">>;

export type GistSubmissionWithSlug = GistSubmission & Pick<Gist, "slug">;

export type GistInfo = Omit<Gist, "comments"> & {
  filesCount: number;
  commentsCount: number;
};

export type Comment = C;

export type CommentSubmission = Pick<Comment, "content">;
