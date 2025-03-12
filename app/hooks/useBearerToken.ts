import { useEffect, useState } from "react";

const useBearerToken = (userId: string | null) => {
    const [bearerToken, setBearerToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrCreateBearerToken = async () => {
            if (!userId) return;

            try {
                // First try to fetch existing token
                const response = await fetch(`/api/bearer-token?userId=${userId}`);
                const data = await response.json();

                if (data.key) {
                    setBearerToken(data.key);
                } else {
                    // If no token exists, create one
                    const createResponse = await fetch(`/api/bearer-token?userId=${userId}`, {
                        method: 'POST',
                    });
                    const createData = await createResponse.json();
                    if (createData.key) {
                        setBearerToken(createData.key);
                    }
                }
            } catch (error) {
                console.error("Error managing bearer token:", error);
            }
        };

        fetchOrCreateBearerToken();
    }, [userId]);

    return bearerToken;
};

export default useBearerToken;