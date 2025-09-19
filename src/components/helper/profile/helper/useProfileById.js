import {
  useSignalProviderProfileById,
  useUserProfileById,
} from "@/src/hooks/useApi";

export const useProfileById = (id, type) => {
  // Return an empty object with data property to avoid undefined errors when id or type are missing
  if (!id || !type) {
    return { data: null, isLoading: false, error: null, refetch: () => { } };
  }

  if (type === "USER") {
    const result = useUserProfileById(id);
    return result;
  }
  if (type === "SIGNAL_PROVIDER") {
    const result = useSignalProviderProfileById(id);
    return result;
  }

  // Return a safe fallback object
  return { data: null, isLoading: false, error: null, refetch: () => { } };
};
