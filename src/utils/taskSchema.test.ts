import { describe, expect, it } from "vitest";
import { status, createTaskSchema } from "./taskSchema.ts";

describe("Create task schema validation", () => {
  it("should return status is required if status is invalid", () => {
    const mockStatus = "finish";

    expect(() => {
      status.parse(mockStatus);
    }).toThrow(
      "Please select a valid status(Pending, In Progress, or Completed)",
    );
  });

  it("should pass if status value is valid", () => {
    const mockStatus = "PENDING";

    const res = status.parse(mockStatus);
    expect(res).toBe("PENDING");
  });

  it("should fail if the title is empty", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    expect(() => {
      createTaskSchema.parse({
        title: "",
        description: "abc",
        deadlineAt: dateStr,
      });
    }).toThrow("title is required");
  });

  it("should fail if deadline is sooner than today", () => {
    const mockTitle = "mock title";

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    expect(() => {
      createTaskSchema.parse({
        title: mockTitle,
        deadlineAt: dateStr,
      });
    }).toThrow("deadline must equal to or later than today");
  });

  it("should pass if those inputs are valid", () => {
    const mockTitle = "mock task";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    expect(() => {
      createTaskSchema.parse({
        title: mockTitle,
        deadlineAt: dateStr,
      });
    }).not.toThrow();
  });
});
