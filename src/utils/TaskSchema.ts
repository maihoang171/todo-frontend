import * as z from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  deadlineAt: z
    .string()
    .date()
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return date >= new Date();
    }, "Deadline must be in equal or larger than today"),
});

export type createTaskRequest = z.infer<typeof createTaskSchema>
