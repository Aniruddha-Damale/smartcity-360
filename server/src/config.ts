import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  },
  ai: {
    apiKey: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '',
    provider: process.env.OPENAI_API_KEY ? 'openai' : (process.env.GEMINI_API_KEY ? 'gemini' : 'built-in-demo'),
    isConfigured: Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY),
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || 'mock',
    isConfigured: Boolean(process.env.EMAIL_PROVIDER && process.env.SMTP_HOST),
  },
  isDemoMode: !process.env.SUPABASE_URL,
};
