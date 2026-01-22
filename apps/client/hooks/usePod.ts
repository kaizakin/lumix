import { getPodAction } from "@/actions/getPodAction";
import { useQuery } from "@tanstack/react-query";

export function usePod(podId: string) {
    const query = useQuery({
        queryKey: ['pod', podId],
        queryFn: () => getPodAction(podId)
    })

    return query;

}