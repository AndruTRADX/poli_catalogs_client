import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  const getCurrentUser = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return null;
    },
    enabled: false,
  });

  return {
    getCurrentUser,
  };
}; 