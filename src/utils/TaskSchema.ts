import * as z from "zod";

export const status = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
  message: "Please select a valid status(Pending, In Progress, or Completed)",
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  description: z.string().optional(),
  deadlineAt: z
    .string()
    .min(1, "deadline is required")
    .refine((dateStr) => {
      const inputDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0);
      return inputDate >= today;
    }, "deadline must equal to or later than today"),
});
export const updateTaskSchema = createTaskSchema.extend({
  status,
});

export type statusRequest = z.infer<typeof status>;
export type createTaskRequest = z.infer<typeof createTaskSchema>;
export type updateTaskRequest = z.infer<typeof updateTaskSchema>;
