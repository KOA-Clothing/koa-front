import { z } from "zod";

export const ColorDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  hexCode: z.string().nullable().optional(),
  swatchImageUrl: z
    .preprocess(
      (val) => (val === "" ? null : val), 
      z.string().nullable().optional()
    ),
  isActive: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type ColorDto = z.infer<typeof ColorDtoSchema>;

export const ColorFormInputSchema = ColorDtoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
}).extend({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  hexCode: z.string().max(6).nullable().optional(),
  swatchImageUrl: z.string()
    .max(500, "Swatch image URL must not exceed 500 characters")
    .nullable()
    .optional()
});

export type ColorFormInput = z.infer<typeof ColorFormInputSchema>;

export const emptyColorForm: ColorFormInput = {
  name: "",
  hexCode: "",
  swatchImageUrl: "",
};

export function toCategoryForm(color: ColorDto): ColorFormInput {
  return {
    name: color.name,
    hexCode: color.hexCode,
    swatchImageUrl: color.swatchImageUrl ?? "",
  };
}
