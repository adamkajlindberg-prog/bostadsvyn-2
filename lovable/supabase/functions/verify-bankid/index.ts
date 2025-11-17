import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { userId } = await req.json();

    if (userId !== user.id) {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Can only verify your own identity",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // In production, this would integrate with the Swedish BankID API
    // For development/demo, we'll simulate a successful verification

    // Production implementation would:
    // 1. Call BankID API to initiate authentication
    // 2. Return QR code or auto-start token
    // 3. Poll for completion
    // 4. Verify the signature
    // 5. Extract personal number and other verified data

    // Simulated verification (REMOVE IN PRODUCTION)
    const verificationData = {
      verified: true,
      personalNumber: "XXXXXXXX-XXXX", // Encrypted in production
      verifiedAt: new Date().toISOString(),
    };

    // Update profile with verification status
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({
        bankid_verified: true,
        bankid_verified_at: verificationData.verifiedAt,
        bankid_personal_number: verificationData.personalNumber,
      })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // Log to security audit
    await supabaseClient.from("security_audit_log").insert({
      user_id: userId,
      event_type: "bankid_verification",
      event_category: "auth",
      severity: "info",
      action_performed: "User completed BankID verification",
      metadata: {
        verification_method: "bankid",
        timestamp: verificationData.verifiedAt,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        verified: true,
        message: "BankID verification completed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("BankID verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
