import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LandlordInfo {
  id: string;
  legal_name: string;
  business_name: string | null;
  organization_number: string | null;
  personal_number: string | null;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
  tin: string | null;
  vat_number: string | null;
  entity_type: string;
  email: string;
  phone: string | null;
}

interface RentalIncome {
  id: string;
  property_address: string;
  property_type: string;
  rental_income: number;
  reporting_period_start: string;
  reporting_period_end: string;
  rental_days: number;
  reported_to_skatteverket: boolean;
}

serve(async (req) => {
  // Handle CORS
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

    // Get authenticated user
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

    const { reportingYear, format = "csv" } = await req.json();

    if (!reportingYear) {
      return new Response(
        JSON.stringify({ error: "Reporting year is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Fetch landlord info
    const { data: landlordInfo, error: landlordError } = await supabaseClient
      .from("dac7_landlord_info")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (landlordError || !landlordInfo) {
      return new Response(
        JSON.stringify({
          error:
            "Landlord information not found. Please complete your DAC7 registration first.",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Fetch rental incomes for the specified year
    const yearStart = `${reportingYear}-01-01`;
    const yearEnd = `${reportingYear}-12-31`;

    const { data: rentalIncomes, error: incomeError } = await supabaseClient
      .from("dac7_rental_income")
      .select("*")
      .eq("landlord_info_id", landlordInfo.id)
      .gte("reporting_period_start", yearStart)
      .lte("reporting_period_end", yearEnd)
      .order("reporting_period_start", { ascending: true });

    if (incomeError) {
      throw incomeError;
    }

    if (!rentalIncomes || rentalIncomes.length === 0) {
      return new Response(
        JSON.stringify({
          error: `No rental income data found for ${reportingYear}`,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Generate report based on format
    let reportContent: string;
    let contentType: string;
    let filename: string;

    if (format === "csv") {
      reportContent = generateCSVReport(
        landlordInfo,
        rentalIncomes,
        reportingYear,
      );
      contentType = "text/csv";
      filename = `DAC7_Report_${reportingYear}_${user.id.substring(0, 8)}.csv`;
    } else if (format === "xml") {
      reportContent = generateXMLReport(
        landlordInfo,
        rentalIncomes,
        reportingYear,
      );
      contentType = "application/xml";
      filename = `DAC7_Report_${reportingYear}_${user.id.substring(0, 8)}.xml`;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid format. Use "csv" or "xml"' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(reportContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating DAC7 report:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateCSVReport(
  landlord: LandlordInfo,
  incomes: RentalIncome[],
  year: string,
): string {
  const headers = [
    "Reporting Year",
    "Platform Operator Name",
    "Landlord Legal Name",
    "Landlord Business Name",
    "Entity Type",
    "TIN",
    "VAT Number",
    "Address",
    "Postal Code",
    "City",
    "Country",
    "Email",
    "Phone",
    "Property Address",
    "Property Type",
    "Rental Income (SEK)",
    "Rental Days",
    "Period Start",
    "Period End",
  ].join(",");

  const rows = incomes.map((income) => {
    return [
      year,
      "Bostadsvyn AB",
      escapeCsv(landlord.legal_name),
      escapeCsv(landlord.business_name || ""),
      landlord.entity_type,
      landlord.tin || "",
      landlord.vat_number || "",
      escapeCsv(landlord.street_address),
      landlord.postal_code,
      escapeCsv(landlord.city),
      landlord.country,
      landlord.email,
      landlord.phone || "",
      escapeCsv(income.property_address),
      income.property_type,
      income.rental_income.toFixed(2),
      income.rental_days,
      income.reporting_period_start,
      income.reporting_period_end,
    ].join(",");
  });

  return [headers, ...rows].join("\n");
}

function generateXMLReport(
  landlord: LandlordInfo,
  incomes: RentalIncome[],
  year: string,
): string {
  const totalIncome = incomes.reduce(
    (sum, income) => sum + income.rental_income,
    0,
  );
  const totalDays = incomes.reduce(
    (sum, income) => sum + income.rental_days,
    0,
  );

  const incomeElements = incomes
    .map(
      (income) => `
    <RentalIncome>
      <PropertyAddress>${escapeXml(income.property_address)}</PropertyAddress>
      <PropertyType>${income.property_type}</PropertyType>
      <Amount currency="SEK">${income.rental_income.toFixed(2)}</Amount>
      <RentalDays>${income.rental_days}</RentalDays>
      <PeriodStart>${income.reporting_period_start}</PeriodStart>
      <PeriodEnd>${income.reporting_period_end}</PeriodEnd>
    </RentalIncome>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<DAC7Report xmlns="urn:oecd:ties:dpi:v1" version="1.0">
  <MessageSpec>
    <ReportingPeriod>${year}</ReportingPeriod>
    <Timestamp>${new Date().toISOString()}</Timestamp>
  </MessageSpec>
  <PlatformOperator>
    <Name>Bostadsvyn AB</Name>
    <Country>SE</Country>
  </PlatformOperator>
  <ReportableSeller>
    <Identity>
      <LegalName>${escapeXml(landlord.legal_name)}</LegalName>
      ${landlord.business_name ? `<BusinessName>${escapeXml(landlord.business_name)}</BusinessName>` : ""}
      <EntityType>${landlord.entity_type}</EntityType>
      ${landlord.tin ? `<TIN>${landlord.tin}</TIN>` : ""}
      ${landlord.vat_number ? `<VAT>${landlord.vat_number}</VAT>` : ""}
    </Identity>
    <Address>
      <Street>${escapeXml(landlord.street_address)}</Street>
      <PostalCode>${landlord.postal_code}</PostalCode>
      <City>${escapeXml(landlord.city)}</City>
      <Country>${landlord.country}</Country>
    </Address>
    <Contact>
      <Email>${landlord.email}</Email>
      ${landlord.phone ? `<Phone>${landlord.phone}</Phone>` : ""}
    </Contact>
  </ReportableSeller>
  <RentalActivities>
    <TotalIncome currency="SEK">${totalIncome.toFixed(2)}</TotalIncome>
    <TotalRentalDays>${totalDays}</TotalRentalDays>
    <NumberOfProperties>${incomes.length}</NumberOfProperties>
    ${incomeElements}
  </RentalActivities>
</DAC7Report>`;
}

function escapeCsv(str: string): string {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
