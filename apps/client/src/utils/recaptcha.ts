/**
 * Google reCAPTCHA Enterprise Utility
 * 
 * Correct flow:
 * 1. Load reCAPTCHA Enterprise script: https://www.google.com/recaptcha/enterprise.js?render={SITE_KEY}
 * 2. Call grecaptcha.enterprise.execute(SITE_KEY, { action }) to get a token
 * 3. Send token to backend API
 * 4. Backend verifies token server-side with Google's API
 */

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

const RECAPTCHA_SITE_KEY = '6LfvF7AnAAAAADuStGW8G_ryWrwmnGbbBYbghZPG';
const RECAPTCHA_SCRIPT_ID = 'recaptcha-script';

/**
 * Load reCAPTCHA Enterprise script dynamically
 * Script URL: https://www.google.com/recaptcha/enterprise.js?render={SITE_KEY}
 */
export const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (existingScript) {
      if (window.grecaptcha?.enterprise) {
        resolve();
        return;
      }
      
      // Wait for grecaptcha to be available
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.grecaptcha?.enterprise) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('reCAPTCHA Enterprise not available after script load'));
        }
      }, 100);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait for grecaptcha.enterprise to be available
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.grecaptcha?.enterprise) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('reCAPTCHA Enterprise failed to initialize after script load'));
        }
      }, 100);
    };

    script.onerror = () => {
      reject(new Error('Failed to load reCAPTCHA Enterprise script. Please check your internet connection.'));
    };

    document.head.appendChild(script);
  });
};

// Removed generateRecaptchaPayload - not needed with correct approach
// We use grecaptcha.enterprise.execute() directly instead

/**
 * Execute reCAPTCHA Enterprise and get token
 * 
 * Correct flow:
 * 1. Load the reCAPTCHA Enterprise JS library
 * 2. Call grecaptcha.enterprise.execute(SITE_KEY, { action }) to get a token
 * 3. Return the token to be sent to backend
 * 4. Backend verifies the token server-side
 * 
 * @param action - Action name for reCAPTCHA (default: 'send_otp')
 * @returns Promise<string> - reCAPTCHA token
 */
export const callReloadRecaptchaAPI = async (action: string = 'send_otp'): Promise<string> => {
  try {
    console.error('🔵 [reCAPTCHA] ===== STARTING reCAPTCHA =====');
    console.error('🔵 [reCAPTCHA] Action:', action);
    console.log('[reCAPTCHA] Starting reCAPTCHA execution for action:', action);
    
    // Step 1: Load reCAPTCHA script if not already loaded
    console.error('🔵 [reCAPTCHA] Loading reCAPTCHA script...');
    console.log('[reCAPTCHA] Loading reCAPTCHA script...');
    await loadRecaptchaScript();
    console.error('🔵 [reCAPTCHA] Script loaded successfully');
    console.log('[reCAPTCHA] Script loaded successfully');

    // Step 2: Use grecaptcha.enterprise.execute() - the correct way
    console.error('🔵 [reCAPTCHA] Calling grecaptcha.enterprise.execute()...');
    console.log('[reCAPTCHA] Current origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');
    
    if (!window.grecaptcha?.enterprise?.execute) {
      throw new Error('grecaptcha.enterprise.execute is not available');
    }

    const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action });
    
    console.error('🔵 [reCAPTCHA] Token received, length:', token?.length);
    console.log('[reCAPTCHA] Token generated successfully, length:', token?.length);

    if (!token || typeof token !== 'string' || token.length < 10) {
      console.error('🔴 [reCAPTCHA] Invalid token received:', { token, type: typeof token, length: token?.length });
      throw new Error('Invalid token received from reCAPTCHA');
    }

    console.error('🔵 [reCAPTCHA] ===== SUCCESS =====');
    return token;

  } catch (error: any) {
    console.error('🔴 [reCAPTCHA] ===== ERROR CAUGHT =====');
    console.error('🔴 [reCAPTCHA] Error Message:', error.message);
    console.error('🔴 [reCAPTCHA] Error Stack:', error.stack);
    console.error('[reCAPTCHA] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
      throw new Error('Network error: Failed to connect to reCAPTCHA. Please check your internet connection.');
    }

    throw new Error(`reCAPTCHA failed: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Execute reCAPTCHA and get token
 * Uses the reload API mechanism via callReloadRecaptchaAPI
 * 
 * @param action - Action name for reCAPTCHA (e.g., 'login', 'send_otp', 'signup')
 * @returns Promise<string> - Captcha token
 */
export const executeRecaptcha = async (action: string = 'send_otp'): Promise<string> => {
  console.error('🚀 [reCAPTCHA] executeRecaptcha CALLED with action:', action);
  console.log('[reCAPTCHA] executeRecaptcha called with action:', action);
  return callReloadRecaptchaAPI(action);
};

/**
 * Get reCAPTCHA token for send OTP action
 * Convenience function specifically for send OTP flow
 * 
 * @returns Promise<string> - Captcha token for send OTP
 */
export const getRecaptchaTokenForSendOTP = async (): Promise<string> => {
  console.error('🚀 [reCAPTCHA] getRecaptchaTokenForSendOTP CALLED');
  console.log('[reCAPTCHA] getRecaptchaTokenForSendOTP called');
  return callReloadRecaptchaAPI('send_otp');
};
