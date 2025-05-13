// Replace with your actual keys or import from a constants file
const consumerKey = "nbZBtDnSEt9X+l0cHNDFren+7dTQIJXl";
const consumerSecret = "3p2NhatNMO64hzQpqGUs062LTvE=";

/**
 * Generate a unique order ID: yyyyMMddHHmmss + 3-digit random number
 */
export function generateOrderIdWithDate() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const uniqueSuffix = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return datePart + uniqueSuffix;
}

/**
 * Request Pesapal bearer token
 */
export async function requestPesapalToken() {
    try {
        const response = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                consumer_key: consumerKey,
                consumer_secret: consumerSecret
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Token error:', errorData);
            return null;
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Token error:', error.message);
        return null;
    }
}

/**
 * Register IPN URL
 */
export async function registerIpn(bearerToken, ipnUrl) {
    try {
        const response = await fetch('https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify({
                url: ipnUrl,
                ipn_notification_type: 'GET'
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('IPN error:', errorData);
            return null;
        }

        const data = await response.json();
        return data.ipn_id;
    } catch (error) {
        console.error('IPN error:', error.message);
        return null;
    }
}

/**
 * Submit Pesapal order
 */
export async function submitOrder({
    bearerToken,
    ipnId,
    amount,
    email,
    callbackUrl,
    description
}) {
    try {
        const response = await fetch('https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify({
                id: generateOrderIdWithDate(),
                currency: "KES",
                amount,
                paymentMethod: "MPESA",
                description,
                callback_url: callbackUrl,
                notification_id: ipnId,
                billing_address: {
                    email_address: email,
                    country_code: "KE"
                }
            })

            //url: window.location.origin + location.pathname,
            //callbackUrl: window.location.origin + redirectPath,
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Submit order failed:', errorData);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Submit order failed:', error.message);
        return null;
    }
}

/**
 * Check transaction status
 */
export async function checkTransactionStatus(orderTrackingId) {
    const token = await requestPesapalToken();
    if (!token) return null;

    try {
        const response = await fetch(`https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Status error:', errorData);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Status error:', error.message);
        return null;
    }
}
