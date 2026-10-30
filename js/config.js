/**
 * MONSTER MATCH - CONFIGURATION MODULE
 * Holds Supabase credentials and system configuration.
 */

export const CONFIG = {
  APP_NAME: 'Monster Match',
  APP_TAGLINE: 'Find Your Project Teammate',
  VERSION: '1.0.0',

  // Supabase Configuration
  // Connected to live Supabase backend
  SUPABASE_URL: window.ENV_SUPABASE_URL || 'https://awhvbfsjrjsydrhnimkx.supabase.co',
  SUPABASE_ANON_KEY: window.ENV_SUPABASE_ANON_KEY || 'sb_publishable_lX_RcdKEXp1t0EfMLtOJ9Q_nKlLZlUW',

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
