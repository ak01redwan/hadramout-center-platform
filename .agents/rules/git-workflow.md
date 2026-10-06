# Git Version Control & GitHub Synchronization Standards
**Platform:** Hadhramout Center for Historical Studies, Documentation and Publishing  
**Engineering Lead:** Eng. Abdulrahman Khaled Radwan (`ak01redwan`) — Novixa (`Novixa`)

---

## 1. Always-Sync Policy
Whenever modifications, new features, bug fixes, or documentation updates are completed and validated:
1. All changes must be cleanly committed and pushed to `origin/master`.
2. Working tree must be kept clean with no uncommitted stragglers or untracked debris.

## 2. Commit Message Standards (Conventional Commits)
All commit messages must follow the standard convention:
`<type>(<scope>): <short imperative description>`

### Allowed Types:
- `feat`: A new feature (e.g. search filter, audio player, export format).
- `fix`: A bug fix (e.g. mobile drawer glitch, 404 URL fix, font alignment).
- `docs`: Documentation updates (e.g. PRD, user manuals, handover guides).
- `style`: Formatting, whitespace, semicolon fixes (no code logic changes).
- `refactor`: Code restructuring without behavioral changes.
- `perf`: Performance improvements (e.g. image optimization, script load order).
- `test`: Adding or updating validation scripts and test suites.
- `chore`: Maintenance tasks, package configuration, workflow scripts.

### Examples:
- `feat(citations): add BibTeX and EndNote RIS export options`
- `fix(rtl): fix text alignment on Arabic timeline milestones`
- `docs(manual): add comprehensive Arabic testing guide and user manual`
- `chore(git): establish automated agent development rules and standards`

## 3. Pre-Commit Verification Checklist
Before running `git commit`:
- [ ] Run `node scripts/validate.js` and ensure all tests pass (100%).
- [ ] Check `git status` to verify only intended files are staged.
- [ ] Ensure no secret API keys, sensitive tokens, or private credentials are in git-tracked files.
- [ ] Push to remote: `git push origin master`.
