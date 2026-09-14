"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import {
  AgeGroupEnum,
  GenderEnum,
  ProductStatusEnum,
} from "@/types/enums";
import type { ProductFormInput } from "@/types/product";

const invalidateKeys = [queryKeys.products.all] as const;

/** All product mutations (create, update, delete). */
export function useProductMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, ProductFormInput>({
    mutationFn: (payload) => axiosClient.post(API_ROUTES.PRODUCTS.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product created successfully!",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.PRODUCTS.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product deleted successfully!",
  });

  const update = useAppMutation<void, { id: string; payload: ProductFormInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(API_ROUTES.PRODUCTS.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product updated successfully!",
  });

  const toggleActiveStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.post(API_ROUTES.PRODUCTS.TOGGLE_ACTIVE_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product updated",
  });

  const toggleFeaturedStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.post(API_ROUTES.PRODUCTS.TOGGLE_FEATURED_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product updated",
  });

  const changeGender = useAppMutation<void, { id: string; gender: GenderEnum }>({
    mutationFn: ({ id, gender }) =>
      axiosClient
        .post(API_ROUTES.PRODUCTS.CHANGE_GENDER(id), { newGender: Number(gender) })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product gender updated",
  });

  const changeAgeGroup = useAppMutation<void, { id: string; ageGroup: AgeGroupEnum }>({
    mutationFn: ({ id, ageGroup }) =>
      axiosClient
        .post(API_ROUTES.PRODUCTS.CHANGE_AGE_GROUP(id), { newAgeGroup: Number(ageGroup) })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product age group updated",
  });

  const changeProductStatus = useAppMutation<void, { id: string; status: ProductStatusEnum }>({
    mutationFn: ({ id, status }) =>
      axiosClient
        .post(API_ROUTES.PRODUCTS.CHANGE_PRODUCT_STATUS(id), { newProductStatus: Number(status) })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product status updated",
  });

  return {
    create,
    remove,
    update,
    toggleActiveStatus,
    toggleFeaturedStatus,
    changeGender,
    changeAgeGroup,
    changeProductStatus,
  };
}