import { useRouter } from "next/navigation";

export const useUpdateURL = () => {
  const router = useRouter();

  const updateURL = (
    params: Record<string, string | number | boolean | undefined>
  ) => {
    const newSearchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) {
        newSearchParams.set(key, String(value));
      }
    });

    const newURL = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname;

    router.push(newURL, { scroll: false });
  };

  return { updateURL };
};