import { z } from "zod";

export const DesignDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type DesignDto = z.infer<typeof DesignDtoSchema>;

export const DesignFormInputSchema = DesignDtoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
}).extend({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  description: z.string().nullable().optional(),
});

export type DesignFormInput = z.infer<typeof DesignFormInputSchema>;

export const emptyDesignForm: DesignFormInput = {
  name: "",
  description: "",
};

export function toDesignForm(design: DesignDto): DesignFormInput {
  return {
    name: design.name,
    description: design.description ?? "",
  };
}
