/**
 * MONSTER MATCH - SUPABASE EDGE / SERVERLESS FUNCTION
 * Phase 8: WhatsApp Business Cloud API Integration
 *
 * Secure server-side endpoint for triggering WhatsApp notification templates.
 * Access tokens and Phone Number IDs are strictly kept in environment variables.
 */

// Headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handleRequest(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { receiver_phone, receiver_name, template_type, sender_name, project_title } = await req.json();

    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return new Response(
        JSON.stringify({ 
          error: 'WhatsApp Cloud API credentials not configured on server.',
          hint: 'Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in Supabase environment secrets.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Template payload mapping
    let templatePayload = {};

    if (template_type === 'connection_request_alert') {
      templatePayload = {
        name: 'connection_request_alert',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: receiver_name || 'Hacker' },
              { type: 'text', text: sender_name || 'A student' },
              { type: 'text', text: project_title || 'a hackathon project' }
            ]
          }
        ]
      };
    } else if (template_type === 'request_accepted') {
      templatePayload = {
        name: 'request_accepted',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: receiver_name || 'Hacker' },
              { type: 'text', text: sender_name || 'Your teammate' }
            ]
          }
        ]
      };
    }

    // Call Meta WhatsApp Business Cloud API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: receiver_phone,
          type: 'template',
          template: templatePayload
        })
      }
    );

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
