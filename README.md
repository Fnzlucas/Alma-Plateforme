# Alma Food — Guide de déploiement

## Ce que tu vas obtenir
- `ton-domaine.com` → Landing page login
- `ton-domaine.com/dashboard` → Plateforme food de Jean-Philippe
- Données sauvegardées en base Supabase (multi-appareils, persistantes)
- SumUp connecté pour importer les transactions automatiquement

---

## Étape 1 — Supabase (10 min)

1. Va sur [supabase.com](https://supabase.com) → **New project**
2. Nom : `alma-food`, région : Europe West
3. Une fois créé, va dans **SQL Editor**
4. Colle et exécute le fichier `supabase-schema.sql`
5. Va dans **Settings > API** et note :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Créer le compte de Jean-Philippe
1. Va dans **Authentication > Users > Add user**
2. Email : email de Jean-Philippe
3. Password : un mot de passe temporaire
4. Il recevra un email pour se connecter

---

## Étape 2 — SumUp (5 min)

1. Va sur [developer.sumup.com](https://developer.sumup.com)
2. Crée une application OAuth
3. Redirect URI : `https://TON-DOMAINE.com/api/sumup/callback`
4. Note le `Client ID` et `Client Secret`

---

## Étape 3 — GitHub (2 min)

1. Crée un repo GitHub (privé)
2. Push ce dossier :
```bash
cd alma-food
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TON_USER/alma-food.git
git push -u origin main
```

---

## Étape 4 — Vercel (5 min)

1. Va sur [vercel.com](https://vercel.com) → **New Project**
2. Importe ton repo GitHub `alma-food`
3. Dans **Environment Variables**, ajoute :

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJ...
SUPABASE_SERVICE_ROLE_KEY       = eyJ...
NEXT_PUBLIC_APP_URL             = https://ton-domaine.com
SUMUP_CLIENT_ID                 = ton_client_id
SUMUP_CLIENT_SECRET             = ton_client_secret
```

4. Clique **Deploy** → le site est en ligne en 2 min

---

## Étape 5 — Domaine (2 min)

1. Dans Vercel → **Settings > Domains**
2. Ajoute `ton-domaine.com`
3. Configure les DNS chez ton registrar (Vercel te donne les valeurs)

---

## Flux utilisateur

```
Jean-Philippe va sur ton-domaine.com
→ Il entre son email + mot de passe
→ Il est redirigé vers /dashboard
→ La plateforme food s'ouvre avec ses données
→ Il clique "Connecter SumUp" (une seule fois)
→ Ensuite "Sync SumUp" importe ses transactions
```

---

## Structure des données Supabase

| Clé (`food_data.key`) | Contenu |
|---|---|
| `sf_inv_v4` | Inventaire Street Food |
| `cm_inv_v1` | Inventaire Croquez Moi |
| `sf_prices` / `cm_prices` | Prix d'achat et vente |
| `sf_enc` / `cm_enc` | Encaissements |
| `sf_crm` / `cm_crm` | CRM clients |
| `sf_factures` / `cm_factures` | Factures |
| `docs_sf` / `docs_cm` | Devis et contrats |
| `emp_sf` / `emp_cm` | Employés |
| `cal_events` | Calendrier Croquez Moi |
| `cm_amort` | Amortissements matériel |
| `cm_km` | Frais kilométriques |
| `sumup_token` | Token OAuth SumUp |

---

## Ajouter un nouveau client plus tard

1. Supabase → Authentication > Add user
2. Dans `profiles`, mettre `app_type = 'food'` (ou autre app future)
3. Voilà — il peut se connecter et a ses propres données isolées
