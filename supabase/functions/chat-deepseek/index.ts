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
        const { prompt } = await req.json()
        // @ts-ignore
        const apiKey = Deno.env.get('DEEPSEEK_API_KEY')

        if (!apiKey) {
            throw new Error('DEEPSEEK_API_KEY is not set in Supabase Secrets.')
        }

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a helpful assistant on FlowStack. Keep your answers focused on digital skills, SaaS, marketing, and business growth." },
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DeepSeek API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json()
        const aiText = data.choices[0].message.content

        return new Response(JSON.stringify({ response: aiText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        // Return 200 so the client receives the error message body instead of a generic 400/500
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
