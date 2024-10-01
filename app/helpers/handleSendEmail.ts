export const handleSendEmail = async (userId : string, userEmail: string) => {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userEmail }), // Include userId and userEmail in the request body
    });

    if (!response.ok) {
        console.error('Error sending email:', await response.text());
    }
};
