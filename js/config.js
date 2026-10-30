/**
 * MONSTER MATCH - CONFIGURATION MODULE
 * Holds Supabase credentials and system configuration.
 */

export const CONFIG = {
  APP_NAME: 'Monster Match',
  APP_TAGLINE: 'Find Your Project Teammate',
  VERSION: '1.0.0',

  // Supabase Configuration
  // Replace these with your live Supabase project URL and anon public key when ready.
  // If left as placeholders, the app automatically switches to Interactive Demo/Mock Mode
  // with pre-seeded student monsters, projects, and connection request simulations!
  SUPABASE_URL: window.ENV_SUPABASE_URL || 'https://xyzcompany.supabase.co',
  SUPABASE_ANON_KEY: window.ENV_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_local_demo',

  // Check if live Supabase is properly configured
  isLiveSupabaseConfigured() {
    return (
      this.SUPABASE_URL &&
      this.SUPABASE_ANON_KEY &&
      !this.SUPABASE_URL.includes('xyzcompany.supabase.co') &&
      !this.SUPABASE_ANON_KEY.includes('dummy_anon_key')
    );
  },

  // WhatsApp Defaults
  DEFAULT_WA_MESSAGE: (userName, projectName) =>
    `Hi ${userName}! I found your profile on Monster Match and would love to team up on ${projectName || 'a project'}. Let's build something epic! 👾`
};
