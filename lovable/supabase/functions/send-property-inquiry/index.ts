import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PropertyInquiryRequest {
  propertyId: string;
  propertyTitle: string;
  propertyPrice?: number;
  propertyAddress?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  hasLoanPromise: boolean;
  brokerEmail?: string;
  brokerName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      propertyId,
      propertyTitle,
      propertyPrice,
      propertyAddress,
      firstName,
      lastName,
      email,
      phone,
      message,
      hasLoanPromise,
      brokerEmail,
      brokerName,
    }: PropertyInquiryRequest = await req.json();

    console.log("Sending property inquiry email:", {
      propertyId,
      propertyTitle,
      firstName,
      lastName,
      brokerEmail,
    });

    const recipientEmail = brokerEmail || "demo@example.com";
    const recipientName = brokerName || "Mäklare";

    const emailResponse = await resend.emails.send({
      from: "Fastighetsförfrågan <onboarding@resend.dev>",
      to: [recipientEmail],
      replyTo: email,
      subject: `Ny förfrågan för ${propertyTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .property-info {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #4F46E5;
            }
            .property-info h2 {
              margin: 0 0 10px 0;
              color: #1f2937;
            }
            .property-info p {
              margin: 5px 0;
              color: #6b7280;
            }
            .section {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 15px;
            }
            .section h3 {
              margin: 0 0 15px 0;
              color: #1f2937;
              font-size: 16px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
            }
            .info-row {
              display: flex;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 600;
              color: #4b5563;
              min-width: 140px;
            }
            .info-value {
              color: #1f2937;
            }
            .message-box {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 6px;
              border-left: 3px solid #4F46E5;
              margin-top: 10px;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 13px;
              font-weight: 600;
            }
            .badge-yes {
              background-color: #d1fae5;
              color: #065f46;
            }
            .badge-no {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 15px;
              color: #6b7280;
              font-size: 13px;
            }
            .cta-button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 15px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Ny fastighetsförfrågan</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Du har fått en ny intresseanmälan</p>
            </div>
            
            <div class="content">
              <p>Hej ${recipientName},</p>
              <p>En spekulant har visat intresse för följande fastighet:</p>
              
              <div class="property-info">
                <h2>${propertyTitle}</h2>
                ${propertyAddress ? `<p><strong>📍 Adress:</strong> ${propertyAddress}</p>` : ''}
                ${propertyPrice ? `<p><strong>💰 Pris:</strong> ${propertyPrice.toLocaleString('sv-SE')} kr</p>` : ''}
                <p><strong>🔑 Objektnummer:</strong> ${propertyId.substring(0, 8)}</p>
              </div>

              <div class="section">
                <h3>Kontaktinformation</h3>
                <div class="info-row">
                  <span class="info-label">Namn:</span>
                  <span class="info-value">${firstName} ${lastName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">E-post:</span>
                  <span class="info-value"><a href="mailto:${email}">${email}</a></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Telefon:</span>
                  <span class="info-value"><a href="tel:${phone}">${phone}</a></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Lånelöfte:</span>
                  <span class="info-value">
                    <span class="badge ${hasLoanPromise ? 'badge-yes' : 'badge-no'}">
                      ${hasLoanPromise ? 'Ja' : 'Nej'}
                    </span>
                  </span>
                </div>
              </div>

              <div class="section">
                <h3>Meddelande från spekulant</h3>
                <div class="message-box">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <div style="text-align: center; margin-top: 25px;">
                <a href="mailto:${email}" class="cta-button">Svara på förfrågan</a>
              </div>
            </div>

            <div class="footer">
              <p>Detta mejl skickades automatiskt från din fastighetsplattform.</p>
              <p>Svara direkt till spekulanten via <a href="mailto:${email}">${email}</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-property-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
