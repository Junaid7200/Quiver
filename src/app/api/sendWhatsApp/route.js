import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request) {
    try {
        const { toNumber, message } = await request.json();

        if (!toNumber || !message) {
            return new Response(JSON.stringify({ error: 'Missing toNumber or message' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const msg = await client.messages.create({
            body: message,
            from: 'whatsapp:+14155238886', // Twilio Sandbox number
            to: `whatsapp:${toNumber}`
        });

        return new Response(JSON.stringify({ sid: msg.sid }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Twilio send error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
