export const siteConfig = {
  name: "YouTube Transcript API",
  company: "DTech DevOps",
  email: "dtech4099@gmail.com",
  website: "https://youtube-transcript-api-production-0221.up.railway.app",
  rapidApiMarketplaceUrl: "https://rapidapi.com/dtech4099/api/youtube-transcript27",
  rapidApiBaseUrl: "https://youtube-transcript27.p.rapidapi.com",
  description:
    "Extract transcripts, captions, metadata, and languages from YouTube videos instantly."
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Documentation" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" }
];

export const features = [
  "Batch processing",
  "Transcript extraction",
  "Clean text output",
  "Metadata extraction",
  "Language detection",
  "OpenAPI support",
  "Global deployment",
  "Rate limiting",
  "Fast response times"
];

export const endpoints = [
  { method: "POST", path: "/api/batch", description: "Process multiple videos in one request." },
  { method: "GET", path: "/api/transcript", description: "Retrieve timed transcript segments." },
  {
    method: "GET",
    path: "/api/metadata",
    description: "Fetch title, channel, thumbnail, and description."
  },
  {
    method: "GET",
    path: "/api/languages",
    description: "Discover available transcript languages."
  }
];

export const pricingPlans = [
  { name: "Free", price: "$0", requests: "100 requests", support: "Basic support" },
  { name: "Basic", price: "$5", requests: "10,000 requests", support: "Email support" },
  {
    name: "Professional",
    price: "$10",
    requests: "100,000 requests",
    support: "Priority support",
    featured: true
  },
  { name: "Enterprise", price: "Custom", requests: "Unlimited usage", support: "Dedicated support" }
];

export const faqs = [
  {
    question: "How do I retrieve transcripts?",
    answer:
      "Subscribe through RapidAPI and call GET /api/transcript with a YouTube video ID and optional language code."
  },
  {
    question: "How do I authenticate requests?",
    answer:
      "RapidAPI customers authenticate with x-rapidapi-key and x-rapidapi-host headers. Direct backend access requires a private x-api-key."
  },
  {
    question: "What are the rate limits?",
    answer:
      "Rate limits depend on the selected RapidAPI plan. The backend also includes rate limiting to protect service stability."
  },
  {
    question: "Which languages are supported?",
    answer:
      "Language availability depends on captions exposed by YouTube for each video. Use /api/languages to check common transcript languages."
  },
  {
    question: "How quickly are responses returned?",
    answer:
      "Cached responses are typically very fast. First-time transcript lookups depend on YouTube availability and network latency."
  }
];
