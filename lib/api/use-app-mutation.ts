"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getErrorMessage, getSuccessMessage } from "./errors";

export interface UseAppMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Query keys to invalidate after a successful mutation. */
  invalidateKeys?: readonly (readonly unknown[])[];
  /** Shown on success (respects a `message` field the API may return). */
  successMessage?: string;
  /** Extra side-effects after invalidation + toast (e.g. closing a modal). */
  onSuccess?: (data: TData, variables: TVariables) => void;
}

/**
 * Configures a mutation with the app-wide conventions every modal currently
 * repeats by hand:
 *   - invalidate the affected query key(s) on success,
 *   - toast a success message (server-provided when available),
 *   - toast the extracted error message on failure.
 *
 * Pages/components only supply the HTTP call + labels + what to close:
 *
 *   const { create } = useAddressMutations();
 *   create.mutate(payload, { onSuccess: () => onOpenChange(false) });
 */
export function useAppMutation<TData, TVariables = void>(
  options: UseAppMutationOptions<TData, TVariables>
): UseMutationResult<TData, AxiosError, TVariables> {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: options.mutationFn,
    onSuccess: (data, variables) => {
      for (const queryKey of options.invalidateKeys ?? []) {
        queryClient.invalidateQueries({ queryKey });
      }
      if (options.successMessage) {
        toast.success(getSuccessMessage(data, options.successMessage));
      }
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}