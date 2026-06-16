import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cookieSession from 'cookie-session';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

const requiredEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SESSION_SECRET', 'ADMIN_EMAILS'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required runtime environment variables: ${missingEnv.join(', ')}`);
}

// No inline fallback: an unset/empty allowlist must fail closed (no authorized users),
// never silently grant access to a hardcoded account.
const allowedEmails = new Set(
  process.env.ADMIN_EMAILS
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

if (allowedEmails.size === 0) {
  throw new Error('ADMIN_EMAILS must list at least one authorized email address.');
}

const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.K_SERVICE);
const oauthCallbackUrl = process.env.OAUTH_CALLBACK_URL || '/auth/google/callback';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: oauthCallbackUrl,
      proxy: true,
    },
    (_accessToken, _refreshToken, profile, done) => {
      const emailRecord = profile.emails?.[0];
      const email = emailRecord?.value?.toLowerCase();

      if (!email || emailRecord.verified === false) {
        return done(null, false, { message: 'Google account email is not verified.' });
      }

      if (!allowedEmails.has(email)) {
        return done(null, false, { message: `${email} is not authorized for this app.` });
      }

      return done(null, {
        email,
        displayName: profile.displayName,
        photo: profile.photos?.[0]?.value,
      });
    },
  ),
);

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

// CSP is disabled here: the SPA already declares its own policy via a <meta> tag in
// index.html, and the login page uses an inline <style> block. helmet still adds HSTS,
// clickjacking protection, Referrer-Policy, X-Content-Type-Options, etc.
app.use(helmet({ contentSecurityPolicy: false }));

// Permissions-Policy is not set by helmet; keep it explicit.
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.use(
  cookieSession({
    name: 'nextgenwireless.sid',
    keys: [process.env.SESSION_SECRET],
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 8 * 60 * 60 * 1000,
  }),
);

// passport >=0.6 calls req.session.regenerate()/save() for session-fixation protection,
// but cookie-session implements neither. Shim them as no-ops so logIn/logout don't throw.
app.use((req, _res, next) => {
  if (req.session && typeof req.session.regenerate !== 'function') {
    req.session.regenerate = (cb) => cb();
  }
  if (req.session && typeof req.session.save !== 'function') {
    req.session.save = (cb) => cb();
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Only accept same-origin absolute paths (`/foo`) — reject protocol-relative
// (`//evil.com`) and scheme-bearing values to prevent open redirects.
const safeReturnTo = (candidate) =>
  typeof candidate === 'string' && /^\/[^/\\]/.test(candidate) ? candidate : '/';

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated?.()) {
    return next();
  }

  if (req.method === 'GET' && req.originalUrl !== '/login') {
    req.session.returnTo = safeReturnTo(req.originalUrl);
  }

  return res.redirect('/login');
};

const renderLogin = (error) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="referrer" content="no-referrer">
    <title>NextGenWireless Login</title>
    <style>
      :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #04060d; color: #e2e8f0; }
      main { width: min(92vw, 420px); border: 1px solid #1e293b; background: #0a0d14; border-radius: 12px; padding: 32px; box-shadow: 0 24px 80px rgb(0 0 0 / 0.35); }
      h1 { margin: 0 0 8px; font-size: 24px; letter-spacing: 0; }
      p { margin: 0 0 24px; color: #94a3b8; line-height: 1.5; }
      a { display: inline-flex; width: 100%; justify-content: center; box-sizing: border-box; border-radius: 8px; background: #4f46e5; color: white; padding: 12px 16px; text-decoration: none; font-weight: 700; }
      .error { margin-bottom: 16px; border: 1px solid rgb(220 38 38 / 0.35); background: rgb(220 38 38 / 0.12); color: #fecaca; border-radius: 8px; padding: 12px; font-size: 14px; }
    </style>
  </head>
  <body>
    <main>
      <h1>NextGenWireless</h1>
      <p>Sign in with an authorized Google account to continue.</p>
      ${error ? '<div class="error">This Google account is not authorized for this app.</div>' : ''}
      <a href="/auth/google">Continue with Google</a>
    </main>
  </body>
</html>`;

app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated?.()) {
    return res.redirect('/');
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).send(renderLogin(Boolean(req.query.error)));
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login?error=unauthorized',
  }),
  (req, res) => {
    const redirectTo = safeReturnTo(req.session.returnTo);
    delete req.session.returnTo;
    res.redirect(redirectTo);
  },
);

app.post('/logout', (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session = null;
    res.clearCookie('nextgenwireless.sid');
    res.redirect('/login');
  });
});

app.use(requireAuth, express.static(distPath, { index: false }));

app.get(/.*/, requireAuth, (_req, res) => {
  res.sendFile(indexPath);
});

const port = Number(process.env.PORT || 8080);

app.listen(port, () => {
  console.log(`NextGenWireless server listening on port ${port}`);
});
