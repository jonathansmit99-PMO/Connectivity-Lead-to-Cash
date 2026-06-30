import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiEnabled: !!ai });
});

// 1. Gemini: Draft Contract Endpoint
app.post("/api/gemini/draft-contract", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured. Using standard template instead.",
      });
    }

    const { lead, product } = req.body;
    if (!lead) {
      return res.status(400).json({ error: "Lead details are required." });
    }

    const prompt = `
You are the Senior Corporate Legal Counsel for Reunert Connect (a Reunert company), a premium South African enterprise network and service provider.
Your task is to draft a legally binding, high-quality "Master Services Agreement" (MSA) Addendum between Reunert Connect and the onboarding client.

Client details:
- Company Name: ${lead.companyName}
- Registration Number: ${lead.registrationNumber}
- VAT Number: ${lead.vatNumber}
- Industry: ${lead.industry}
- Address: ${lead.address}
- Authorized Signatory: ${lead.clientName} (Primary)

Product / Service details:
- Service Type: ${product?.serviceType === "enterprise" ? "Enterprise Dedicated Link" : "Broadband Business Link"}
- Selected Vendor: ${product?.vendor || "Fibre Com Connect"}
- Bandwidth Speed: ${product?.bandwidth || "100 Mbps"}
- Contract Term: ${product?.term || "24"} Months

Draft a professional, authoritative agreement containing:
1. Preamble & Parties (Reunert Connect and ${lead.companyName})
2. Service Specification (detailing the ${product?.bandwidth || "100 Mbps"} capacity, ${product?.vendor || "Fibre Com Connect"} last-mile provider)
3. Fees & Payment Terms (citing standard 30-day payment, subject to credit approval)
4. Regulatory Compliance & Verification Clause (aligning with FICA, NCA affordability guidelines, and CIPC regulations)
5. Service Level Agreement (SLA) (99.5% uptime threshold, 4-hour Mean Time to Resolve)
6. Digital Signature blocks.

Format the output cleanly in readable Markdown with bold headings and structured tables. Do not include excessive introductory or concluding remarks, start directly with the agreement title.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ draftText: response.text });
  } catch (error: any) {
    console.error("Error in draft-contract:", error);
    res.status(500).json({ error: error.message || "Failed to draft contract." });
  }
});

// 2. Gemini: Assess Compliance Endpoint
app.post("/api/gemini/assess-compliance", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
      });
    }

    const { lead } = req.body;
    if (!lead) {
      return res.status(400).json({ error: "Lead details are required." });
    }

    const prompt = `
You are an expert Compliance Auditor specialized in South African financial and corporate compliance including FICA (Financial Intelligence Centre Act), National Credit Act (NCA) affordability guidelines, and CIPC (Companies and Intellectual Property Commission) database matching.

Evaluate the following company onboarding profile and documents for potential risks:
Company Profile:
- Name: ${lead.companyName}
- Reg No: ${lead.registrationNumber}
- VAT No: ${lead.vatNumber}
- Industry: ${lead.industry}
- Address: ${lead.address}

Documents Uploaded:
- Registration Papers (CIPC Certificate): ${lead.documents?.registrationPapers ? "Uploaded (Simulated PDF)" : "Missing"}
- Proof of Address (Utility bill): ${lead.documents?.proofOfAddress ? "Uploaded (Simulated PDF)" : "Missing"}
- ID of Signatories: ${lead.documents?.signatoryId ? "Uploaded (Simulated PDF)" : "Missing"}
- Bank Account Proof (Letter from bank): ${lead.documents?.bankProof ? "Uploaded (Simulated PDF)" : "Missing"}
- Tax Info (SARS Certificate): ${lead.documents?.taxInfo ? "Uploaded (Simulated PDF)" : "Missing"}

Conduct a verification. Highlight matches, validation of the registration format (usually YYYY/NNNNNN/NN for South Africa), VAT number validity (usually 10 digits starting with 4), and missing checklist items.
Provide a JSON response with the following format:
{
  "ficaVerified": boolean,
  "cddVerified": boolean,
  "ncaAffordability": boolean,
  "kybVerified": boolean,
  "notes": "A detailed audit summary explaining compliance findings, risks, and next steps.",
  "riskRating": "Low" | "Medium" | "High"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ficaVerified: { type: Type.BOOLEAN },
            cddVerified: { type: Type.BOOLEAN },
            ncaAffordability: { type: Type.BOOLEAN },
            kybVerified: { type: Type.BOOLEAN },
            notes: { type: Type.STRING },
            riskRating: { type: Type.STRING, description: "Low, Medium, or High risk assessment" }
          },
          required: ["ficaVerified", "cddVerified", "ncaAffordability", "kybVerified", "notes", "riskRating"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in assess-compliance:", error);
    res.status(500).json({ error: error.message || "Failed to assess compliance." });
  }
});

// 3. Gemini: Parse Quotation Endpoint
app.post("/api/gemini/parse-quotation", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
      });
    }

    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: "Raw text or quotation content is required." });
    }

    const prompt = `
Extract details from the following raw commercial quotation text into a structured JSON schema for our database.

Raw Quotation Content:
"""
${rawText}
"""

Please parse and populate this structure strictly:
{
  "networkOperator": string (name of operator, e.g., "Fibre Com Connect"),
  "networkType": "Fiber" | "Wireless" | "LTE",
  "networkStatus": "Live" | "WIP",
  "leadTimeWeeks": number (e.g. 4 or 6),
  "bandwidth": string (e.g., "100 Mbps", "1 Gbps"),
  "nrc": number (Non-recurring install cost in ZAR),
  "mrc": number (Monthly recurring cost in ZAR),
  "termMonths": number (usually 12, 24, or 36),
  "lastMileProvider": string,
  "contention": string (e.g., "1:1", "1:10"),
  "provisioningType": "Layer 2" | "Layer 3",
  "notes": string,
  "pricingValidityDays": number
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            networkOperator: { type: Type.STRING },
            networkType: { type: Type.STRING, description: "Fiber, Wireless, or LTE" },
            networkStatus: { type: Type.STRING, description: "Live or WIP" },
            leadTimeWeeks: { type: Type.INTEGER },
            bandwidth: { type: Type.STRING },
            nrc: { type: Type.NUMBER },
            mrc: { type: Type.NUMBER },
            termMonths: { type: Type.INTEGER },
            lastMileProvider: { type: Type.STRING },
            contention: { type: Type.STRING },
            provisioningType: { type: Type.STRING, description: "Layer 2 or Layer 3" },
            notes: { type: Type.STRING },
            pricingValidityDays: { type: Type.INTEGER }
          },
          required: ["networkOperator", "networkType", "networkStatus", "leadTimeWeeks", "bandwidth", "nrc", "mrc", "termMonths", "lastMileProvider", "contention", "provisioningType", "pricingValidityDays"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in parse-quotation:", error);
    res.status(500).json({ error: error.message || "Failed to parse quotation." });
  }
});

// 4. Gemini: Chat / Interactive Lead-to-Cash Assistant Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
      });
    }

    const { messages, currentContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemInstruction = `
You are "Reunert Assist", the Reunert Connect Lead-to-Cash Intelligent Assistant.
Your goal is to help sales agents, clients, legal review, procurement officers, project delivery managers, and customer support representatives collaborate seamlessly.

Context about the active Lead-to-Cash environment:
${currentContext ? JSON.stringify(currentContext, null, 2) : "No active lead context."}

Use this context to answer specific questions about margins, SLA status, FICA compliance issues, contract terms, feasibility details, or customer support issues.
Keep your responses precise, professional, and directly tailored to the Reunert Connect branding.
Always maintain a helpful, enterprise-grade tone. Use clear bullet points and tables where relevant.
`;

    // Map frontend messages format to standard Gemini parts format
    const contents = messages.map((m: any) => ({
      role: m.sender === "Client" || m.sender === "Agent" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in assistant chat:", error);
    res.status(500).json({ error: error.message || "Assistant failed to generate response." });
  }
});

// Integrate Vite middleware for development, serving index.html in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
