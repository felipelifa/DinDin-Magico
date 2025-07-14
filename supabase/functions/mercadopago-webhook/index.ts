import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Only process payment notifications
    if (body.type !== 'payment') {
      return new Response(JSON.stringify({ status: 'ignored' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get payment details from Mercado Pago
    const paymentId = body.data.id;
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')}`,
      },
    });

    if (!paymentResponse.ok) {
      throw new Error(`Failed to get payment details: ${paymentResponse.status}`);
    }

    const payment = await paymentResponse.json();
    console.log('Payment details:', JSON.stringify(payment, null, 2));

    const userId = payment.external_reference;
    const status = payment.status; // approved, rejected, pending, etc.

    // Update subscription status in database
    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('mercadopago_payment_id', payment.preference_id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw updateError;
    }

    // If payment was approved, update user profile
    if (status === 'approved') {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // Add 1 month

      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({
          is_premium: true,
          subscription_status: 'active',
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Update subscription with expiry date
      const { error: expiryError } = await supabaseClient
        .from('subscriptions')
        .update({
          expires_at: expiresAt.toISOString(),
        })
        .eq('user_id', userId)
        .eq('mercadopago_payment_id', payment.preference_id);

      if (expiryError) {
        console.error('Error updating subscription expiry:', expiryError);
      }

      console.log(`User ${userId} upgraded to premium successfully`);
    }

    return new Response(JSON.stringify({ status: 'processed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});