// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("DeepSeek function initialized")

serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Parse Input
        let body;
        try {
            body = await req.json();
        } catch (e) {
            throw new Error("Invalid JSON body");
        }

        const { prompt } = body;
        if (!prompt) {
            throw new Error("Prompt is missing in request body");
        }

        // 2. Get Secret
        // @ts-ignore
        const apiKey = Deno.env.get('DEEPSEEK_API_KEY')
        if (!apiKey) {
            throw new Error('DEEPSEEK_API_KEY is not set in Supabase Secrets')
        }

        // 3. Call DeepSeek
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        })

        // 4. Handle API Error
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DeepSeek API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json()

        // 5. Return Success
        const aiText = data.choices?.[0]?.message?.content || "No response text";

        return new Response(JSON.stringify({ response: aiText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        // 6. Return Error cleanly
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
