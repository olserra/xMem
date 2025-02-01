import { useEffect, useState } from "react";

const useBearerToken = (userId: string | null) => {
    const [bearerToken, setBearerToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchBearerToken = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/bearer-token?userId=${userId}`);
                const data = await response.json();
                if (data.key) {
                    setBearerToken(data.key);
                }
            } catch (error) {
                console.error("Error fetching bearer token:", error);
            }
        };

        fetchBearerToken();
    }, [userId]);

    return bearerToken;
};

export default useBearerToken;