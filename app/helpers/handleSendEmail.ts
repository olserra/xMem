export const handleSendEmail = async (userId : any, userEmail: any) => {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userEmail }),
    });

    if (!response.ok) {
        console.error('Error sending email:', await response.text());
    }
};
