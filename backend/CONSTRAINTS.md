# Backend Development Constraints

## Golden Rules

1. **NEVER touch frontend code** - Any code in `frontend/` folder is off-limits
2. **NEVER modify frontend API client** - The client at `frontend/src/api/client.js` must remain untouched
3. **Always document progress** - Update `BACKEND_ACCOMPLISHMENTS.md` after completing each phase
4. **Use Supabase for DB + Auth** - PostgreSQL via Supabase, not other databases unless specified
5. **Keep sensitive keys secret** - Never commit `.env` files, use `.env.example` as template

## Development Rules

6. **Phase-based development** - Complete one phase before starting the next
7. **Minimal code changes** - Fix what's needed, avoid unnecessary refactoring
8. **Test before commit** - Ensure code compiles and basic endpoints work
9. **Write documentation** - Update README.md as features are added

## What I CAN Do

- Create new files in `backend/` folder
- Create/update `BACKEND_ACCOMPLISHMENTS.md`
- Create/update `backend/README.md`
- Create/update `backend/CONSTRAINTS.md`
- Interact with Supabase via Prisma

## What I CANNOT Do

- Edit any file in `frontend/` folder
- Edit any file in root (except as needed for backend)
- Modify existing frontend API endpoints
- Add new frontend features or components
- Change frontend styling or design

## Communication

10. **Concise responses** - Short, technical updates only
11. **Document completion** - Always mark completed tasks in BACKEND_ACCOMPLISHMENTS.md
12. **Ask before big changes** - If a change affects frontend, ask first
