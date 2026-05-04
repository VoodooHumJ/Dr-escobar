# 🚀 CMS Setup & Delivery Guide (White-Label)

Follow this checklist to deploy a new instance for a client.

## 1. Environment Variables
You need two environments:

### OAuth Gateway (Railway/Render)
- `GITHUB_CLIENT_ID`: From GitHub OAuth App
- `GITHUB_CLIENT_SECRET`: From GitHub OAuth App
- `PORT`: 3000 (default)

### Frontend (Vercel)
- No specific env vars needed, but Ensure `site-config.json` is updated.

## 2. Configuration
Update `site-config.json` with the client data:
- Site name
- Theme colors
- Contact details

## 3. GitHub OAuth App Setup
1. Go to GitHub Settings > Developer Settings > OAuth Apps.
2. New OAuth App.
3. Homepage URL: `https://client-site.vercel.app`
4. Authorization callback URL: `https://your-oauth-gateway.com/callback`

## 4. Deployment Steps
1. Clone this template.
2. Update `site-config.json`.
3. Run `npm install`.
4. Deploy OAuth Gateway.
5. Deploy Frontend to Vercel (Command: `npm run build`).

## 5. Client Checklist
- [ ] Check if `/admin` loads correctly.
- [ ] Verify if images upload to `/uploads`.
- [ ] Verify if static HTML pages are generated in `/public/posts`.
- [ ] Check SEO meta tags on a generated post.
