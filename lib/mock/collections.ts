import type { CollectionDto } from "@/types/collection";

/**
 * Temporary shop-front collection catalogue.
 *
 * Stands in for `GET /collections/all-active` until the storefront query
 * exists. Shapes match `CollectionDto` exactly so swapping this array for a
 * hook response is a one-line change at the call site.
 */
export const mockCollections: CollectionDto[] = [
  {
    id: "6f1c2a3e-8b4d-4f7a-9c1e-2d3b4a5c6e71",
    name: "Denim",
    description:
      "Raw, washed, and built to fade with you. Heavyweight cuts with room to move.",
    itemCount: 18,
    coverImageUrl: "https://picsum.photos/500",
    isActive: true,
    createdAt: "2026-01-12T09:30:00+05:30",
    updatedAt: "2026-02-03T11:15:00+05:30",
  },
  {
    id: "a2d4f6b8-1c3e-4a5f-8b7d-9e0c1a2b3d42",
    name: "Activewear",
    description:
      "Performance pieces for training days — breathable, stretch-first, and cut for movement.",
    itemCount: 24,
    coverImageUrl: "https://picsum.photos/500",
    isActive: true,
    createdAt: "2026-01-18T10:00:00+05:30",
    updatedAt: "2026-02-10T16:45:00+05:30",
  },
  {
    id: "b7e9c1d3-4f5a-4b6c-9d8e-0a1b2c3d4e53",
    name: "Streetwear",
    description:
      "Oversized silhouettes, sharp graphics, and everyday layers with an edge.",
    itemCount: 16,
    coverImageUrl: "https://picsum.photos/500",
    isActive: true,
    createdAt: "2026-01-22T14:20:00+05:30",
    updatedAt: "2026-02-14T09:05:00+05:30",
  },
  {
    id: "c8f0d2e4-5a6b-4c7d-8e9f-1a2b3c4d5e64",
    name: "Essentials",
    description:
      "The foundation layer. Clean tees, tanks, and basics that go with everything.",
    itemCount: 12,
    coverImageUrl: "https://picsum.photos/500",
    isActive: true,
    createdAt: "2026-02-01T08:45:00+05:30",
    updatedAt: "2026-02-18T13:30:00+05:30",
  },
  {
    id: "d9a1e3f5-6b7c-4d8e-9f0a-2b3c4d5e6f75",
    name: "Outerwear",
    description:
      "Jackets and overshirts made for early starts, late nights, and everything between.",
    itemCount: 9,
    coverImageUrl: "https://picsum.photos/500",
    isActive: true,
    createdAt: "2026-02-06T12:10:00+05:30",
    updatedAt: "2026-02-21T15:55:00+05:30",
  },
  {
    id: "e0b2f4a6-7c8d-4e9f-8a1b-3c4d5e6f7a86",
    name: "Loungewear",
    description:
      "Soft, relaxed pieces for the hours you are not in a hurry. Off-duty, on purpose.",
    itemCount: 11,
    coverImageUrl: "https://picsum.photos/500",
    isActive: true,
    createdAt: "2026-02-11T17:25:00+05:30",
    updatedAt: "2026-02-25T10:40:00+05:30",
  },
];
