import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentRequest {
  content: string;
  title: string;
  format: 'word' | 'pdf';
  includeHeaders?: boolean;
  metadata?: {
    author?: string;
    subject?: string;
    keywords?: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title, format, includeHeaders = true, metadata }: DocumentRequest = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating document:', { title, format, contentLength: content.length });

    // Clean and structure the content for document generation
    const structuredContent = await structureContentForDocument(content, title, includeHeaders, openAIApiKey);

    if (format === 'pdf') {
      const htmlContent = await generateHTML(structuredContent, title, metadata);
      return new Response(htmlContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${sanitizeFilename(title)}.html"`,
        },
      });
    } else if (format === 'word') {
      const docContent = await generateWordContent(structuredContent, title, metadata);
      return new Response(docContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="${sanitizeFilename(title)}.txt"`,
        },
      });
    }

    throw new Error('Unsupported format');

  } catch (error) {
    console.error('Document generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Failed to generate document'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function structureContentForDocument(content: string, title: string, includeHeaders: boolean, apiKey: string): Promise<string> {
  const prompt = `Strukturera följande innehåll för att skapa ett professionellt dokument med komplett källhänvisningsförteckning:

TITEL: ${title}

INNEHÅLL:
${content}

INSTRUKTIONER:
1. BEHÅLL ALLA KÄLLHÄNVISNINGAR och samla dem i en separat sektion
2. Organisera innehållet logiskt med tydlig struktur:
   - Sammanfattning
   - Huvudanalys (med underrubriker)
   - Detaljerad information
   - Rekommendationer
   - Fullständig källförteckning
3. Behåll all faktainformation, statistik, tabeller och data
4. Lägg till professionella headers och struktur
5. Formatera som ett komplett analysrapport
6. Använd markdown-formatering för struktur
7. Svenska språket genomgående
8. Inkludera datum för när informationen hämtades
9. Lägg till metodbeskrivning för hur analysen gjorts

Returnera endast det strukturerade innehållet som en komplett rapport:`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: 'Du är en expert på att skapa professionella fastighetsrapporter och analysrapporter med komplett dokumentation och källhänvisningar.' },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 4000,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Error structuring content:', error);
    return content; // Fallback to original content
  }
}

async function generateHTML(content: string, title: string, metadata?: any): Promise<string> {
  const htmlContent = markdownToHTML(content);
  
  return `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @page { margin: 2cm; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 { 
            color: #1e40af; 
            font-size: 2.5em; 
            margin-bottom: 10px;
            text-align: center;
        }
        h2 { 
            color: #1e3a8a; 
            border-bottom: 2px solid #93c5fd; 
            padding-bottom: 8px; 
            margin-top: 35px;
            font-size: 1.5em;
        }
        h3 { 
            color: #1e40af; 
            margin-top: 25px;
            font-size: 1.2em;
        }
        .source { 
            background-color: #eff6ff; 
            padding: 12px 16px; 
            border-left: 4px solid #2563eb; 
            margin: 15px 0; 
            font-style: italic;
            border-radius: 4px;
        }
        .metadata {
            background-color: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #cbd5e1;
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td { 
            border: 1px solid #cbd5e1; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #f1f5f9; 
            font-weight: bold;
            color: #1e40af;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #cbd5e1;
            font-size: 0.9em;
            color: #64748b;
            text-align: center;
        }
        .logo {
            color: #2563eb;
            font-weight: bold;
            font-size: 1.2em;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 20px;
        }
        li {
            margin: 8px 0;
        }
        .highlight {
            background-color: #fef3c7;
            padding: 2px 6px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏠 Framtidsboet.se</div>
        <h1>${title}</h1>
    </div>
    
    ${metadata ? `
    <div class="metadata">
        <strong>📋 Dokumentinformation</strong><br><br>
        <strong>Titel:</strong> ${title}<br>
        ${metadata.author ? `<strong>Genererad av:</strong> ${metadata.author}<br>` : ''}
        ${metadata.subject ? `<strong>Ämnesområde:</strong> ${metadata.subject}<br>` : ''}
        <strong>Genereringsdatum:</strong> ${new Date().toLocaleDateString('sv-SE', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}<br>
        <strong>AI-modell:</strong> GPT-5 med Real-time Data<br>
        ${metadata.keywords ? `<strong>Nyckelord:</strong> ${metadata.keywords.join(', ')}<br>` : ''}
    </div>
    ` : ''}
    
    ${htmlContent}
    
    <div class="footer">
        <strong>Framtidsboet.se AI-Rådgivare</strong><br>
        Genererat: ${new Date().toLocaleDateString('sv-SE')} • Powered by GPT-5 & Real-time Swedish Data
    </div>
</body>
</html>`;
}

async function generateWordContent(content: string, title: string, metadata?: any): Promise<string> {
  return `
FRAMTIDSBOET.SE - FASTIGHETSANALYS
==================================

${title}

${metadata ? `
DOKUMENTINFORMATION:
Titel: ${title}
Genererad av: ${metadata.author || 'Framtidsboet AI-rådgivare'}
Ämnesområde: ${metadata.subject || 'Fastighetsanalys'}
Genereringsdatum: ${new Date().toLocaleDateString('sv-SE')}
AI-modell: GPT-5 med Real-time Data
${metadata.keywords ? `Nyckelord: ${metadata.keywords.join(', ')}` : ''}

` : ''}

${content}

---
DOKUMENTSLUT

Genererat av Framtidsboet.se AI-Rådgivare
Datum: ${new Date().toLocaleDateString('sv-SE')}
Teknik: GPT-5 + Real-time Swedish Data Sources
`;
}

function markdownToHTML(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Source citations with enhanced styling
    .replace(/📋 Källa: (.*)/g, '<div class="source">📋 <strong>Källa:</strong> $1</div>')
    .replace(/📊 Data: (.*)/g, '<div class="source">📊 <strong>Data:</strong> $1</div>')
    .replace(/🔍 Analys: (.*)/g, '<div class="source">🔍 <strong>Analys:</strong> $1</div>')
    .replace(/⚠️ Observera: (.*)/g, '<div class="source" style="border-left-color: #f59e0b;">⚠️ <strong>Observera:</strong> $1</div>')
    
    // Important highlights
    .replace(/VIKTIGT: (.*)/g, '<span class="highlight"><strong>VIKTIGT:</strong> $1</span>')
    
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    
    // Tables (basic markdown table support)
    .replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim());
      return '<tr>' + cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>';
    })
    
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|u|o|t|d])/gm, '<p>')
    .replace(/$/gm, '</p>')
    
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[h|u|o|t|d])/g, '$1')
    .replace(/(<\/[h|u|o|t|d][^>]*>)<\/p>/g, '$1')
    .replace(/<p><li>/g, '<li>')
    .replace(/<\/li><\/p>/g, '</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9åäöÅÄÖ\s-]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 100);
}