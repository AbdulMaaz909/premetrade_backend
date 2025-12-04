# premetrade_backend

Backend for the Premetrade project (Node.js / Express / MongoDB).

This repository contains the API server code. It is intended to be pushed to GitHub from your local repository root `backend/`.

Quick push instructions (PowerShell):

```powershell
# from this folder: C:\Users\abdul\premetrade_backend\backend
git init                        # if not already initialized
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/AbdulMaaz909/premetrade_backend.git
git push -u origin main
```

Notes
- The project serves uploaded files from `/uploads` and those files are added to `.gitignore` by default.
- Make sure you do not push your `.env` file (it is ignored). Add secrets to GitHub Secrets or other secret store when deploying.

If you want, I can create a GitHub remote and push from this environment (you will need to provide credentials/access token), or I can generate a Postman collection or more docs.
