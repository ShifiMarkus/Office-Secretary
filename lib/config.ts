/** כל ההגדרות נקראות מכאן — ומקורן בקובץ ‎.env‎ בלבד */
export const config = {
  sessionSecret: process.env.SESSION_SECRET || "demo-secret-not-for-production",
  microsoft: {
    tenantId: process.env.MS_TENANT_ID || "",
    clientId: process.env.MS_CLIENT_ID || "",
    clientSecret: process.env.MS_CLIENT_SECRET || "",
  },
  mailFrom: process.env.MAIL_FROM || "",
  accessibility: {
    name: process.env.ACCESSIBILITY_COORDINATOR_NAME || "",
    email: process.env.ACCESSIBILITY_COORDINATOR_EMAIL || "",
    phone: process.env.ACCESSIBILITY_COORDINATOR_PHONE || "",
  },
};

/** מצב הדגמה: כל עוד לא הוגדר חיבור ל-Microsoft 365 */
export const isDemoMode = !config.microsoft.clientId;
