import * as z from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  description: z.string().optional(),
  deadlineAt: z
    .string().min(1, "deadline is required")
    .refine((dateStr) => {
      const inputDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0);
      return inputDate >= today;
    }, "deadline must equal to or later than today")
    ,
});

export type createTaskRequest = z.infer<typeof createTaskSchema>;
