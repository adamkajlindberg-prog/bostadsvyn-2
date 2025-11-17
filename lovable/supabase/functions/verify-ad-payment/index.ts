import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("User not authenticated");

    const { sessionId, adId } = await req.json();
    if (!sessionId || !adId) throw new Error("Missing sessionId or adId");

    console.log(`Verifying payment for session ${sessionId}, ad ${adId}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    console.log(`Payment verified for ad ${adId}`);

    // Update ad status to approved and set published date
    const { error: updateError } = await supabaseClient
      .from("ads")
      .update({
        moderation_status: "approved",
        seller_approved_at: new Date().toISOString(),
        payment_status: "paid",
        stripe_session_id: sessionId,
        published_at: new Date().toISOString(),
      })
      .eq("id", adId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating ad:", updateError);
      throw updateError;
    }

    console.log(`Ad ${adId} published successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and ad published",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
