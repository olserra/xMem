import { useEffect, useState, useCallback } from "react";
import { Data } from "../types";

const useFetchData = (userId: string | null, bearerToken: string | null) => {
    const [data, setData] = useState<Data[]>([]);

    const fetchData = useCallback(async () => {
        if (!userId || !bearerToken) return;

        try {
            const [dataRes] = await Promise.all([
                fetch(`/api/_data?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${bearerToken}` },
                }),
            ]);

            const dataData = await dataRes.json();

            setData(dataData.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [userId, bearerToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, setData };
};

export default useFetchData;