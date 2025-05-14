export async function initiatePayment({
    amount,
    countryCode,
    currency,
    description,
    ipnUrl,
    callbackUrl,
    consumerKey,
    consumerSecret,
}) {
    try {
        const response = await fetch('https://all-payments-api.fly.dev/api/pesapal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                countryCode,
                currency,
                description,
                url: ipnUrl,           // IPN URL
                callbackUrl,
                consumerKey,
                consumerSecret,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        return data; // contains redirect_url and order_tracking_id
    } catch (error) {
        console.error('Payment initiation failed:', error);
        return null;
    }
}


export async function checkTransactionStatus({ orderTrackingId, consumerKey, consumerSecret }) {
    try {
        const response = await fetch('https://all-payments-api.fly.dev/api/pesapal/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderTrackingId,
                consumerKey,
                consumerSecret,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        return data; // contains status info
    } catch (error) {
        console.error('Failed to check transaction status:', error);
        return null;
    }
}
