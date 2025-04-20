import { useEffect, useState } from "react";

const useBearerToken = (userId: string | null) => {
    const [bearerToken, setBearerToken] = useState<string | null>(null);

    useEffect(() => {
        console.log('useBearerToken: Effect triggered with userId:', userId);

        const fetchOrCreateBearerToken = async () => {
            if (!userId) {
                console.log('useBearerToken: No userId provided, skipping token fetch');
                return;
            }

            try {
                console.log('useBearerToken: Attempting to fetch existing token for userId:', userId);
                // First try to fetch existing token
                const response = await fetch(`/api/bearer-token?userId=${userId}`);
                const data = await response.json();
                console.log('useBearerToken: Fetch response:', {
                    status: response.status,
                    hasKey: !!data.key,
                    error: data.error
                });

                if (data.key) {
                    console.log('useBearerToken: Found existing token');
                    setBearerToken(data.key);
                } else {
                    console.log('useBearerToken: No existing token found, creating new one');
                    // If no token exists, create one
                    const createResponse = await fetch(`/api/bearer-token?userId=${userId}`, {
                        method: 'POST',
                    });
                    const createData = await createResponse.json();
                    console.log('useBearerToken: Create response:', {
                        status: createResponse.status,
                        hasKey: !!createData.key,
                        error: createData.error
                    });
                    if (createData.key) {
                        console.log('useBearerToken: Successfully created new token');
                        setBearerToken(createData.key);
                    } else {
                        console.log('useBearerToken: Failed to create new token');
                    }
                }
            } catch (error) {
                console.error("useBearerToken: Error managing bearer token:", error);
            }
        };

        fetchOrCreateBearerToken();
    }, [userId]);

    useEffect(() => {
        console.log('useBearerToken: Current token state:', {
            hasToken: !!bearerToken,
            tokenLength: bearerToken?.length
        });
    }, [bearerToken]);

    return bearerToken;
};

export default useBearerToken;