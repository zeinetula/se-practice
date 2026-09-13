# Practice repository — setup and weekly workflow

**Course:** AI-Driven Software Engineering (Fall 2026, KBTU SITE)

You keep **one repository for the whole semester**. Every week gets its own branch, its own
folder, and its own pull request. Do this setup once, in Week 01.

---

## 1. One-time setup

1. Create a GitHub repository named **`se-practice`** (or `software-engineering-practice`).
   - Public is fine. If you make it private, add your instructor as a collaborator.
   - Initialise it with a `README.md` so `main` exists.
2. Submit your **GitHub username** through the registration form posted in Teams.
3. Clone it:

   ```bash
   git clone https://github.com/<your-username>/se-practice.git
   cd se-practice
   ```

4. Put your name and group in the repository `README.md`, commit and push to `main`.

Repository layout by the end of the course:

```
se-practice/
├── README.md
├── .gitignore
├── week-01/
├── week-02/
└── ...
```

---

## 2. Every week — the same five steps

```bash
# 1. start from an up-to-date main
git checkout main
git pull

# 2. new branch for the week  (week-01, week-02, ... always two digits)
git checkout -b week-02

# 3. work inside week-02/ only, committing in small steps
git add week-02
git commit -m "week-02: <what this commit actually does>"

# 4. push
git push -u origin week-02
```

5. On GitHub, open a **Pull Request: `week-NN` → `main`, in your own repository**, then paste the
   **PR link** into that week's assignment in MS Teams.

---

## 3. Rules that decide whether the work counts

- **Never commit to `main`.** All work goes on the `week-NN` branch.
- **Never merge the PR.** Leave it open. Each open PR is one week's reviewable diff; merging
  destroys the separation between weeks.
- **Never delete or force-push a branch after submitting.** The PR link must stay alive until the
  end of the semester.
- **Minimum 3 meaningful commits per week.** One giant "done" commit does not show your process,
  and process is what this course grades. "fix", "update", "asdf" are not messages.
- **The PR link is the submission.** A repo link, a merged PR, or a branch with no PR = not
  submitted.
- **Never commit secrets** — API keys, tokens, `.env` files. Add them to `.gitignore` before the
  first commit. Anything pushed to a public repo is public forever, even after you delete it.
- **Every week needs an `AI_USAGE.md`** in that week's folder. AI use is allowed and expected in
  this course; undisclosed AI use is not.

---

## 4. Pull request description — use this shape every week

```markdown
## What I built
<2–3 sentences>

## AI tools used
<tool + what it did; "none" is a valid answer where the task allows it>

## What the AI got wrong
<at least one concrete example, or "nothing — here is how I verified that">

## Time spent
Manual: __ min · AI-assisted: __ min

## What I would do differently
<1–2 sentences>
```

---

## 5. Recommended `.gitignore`

```gitignore
node_modules/
.next/
dist/
build/
__pycache__/
*.pyc
.venv/
venv/
.env
.env.local
.DS_Store
.idea/
.vscode/
```

---

## 6. If you get stuck

- Nothing to commit → you are probably in the wrong folder. `git status` first, always.
- Wrong branch → `git branch` shows where you are; `git switch week-NN` moves you.
- Committed to `main` by accident → tell your instructor in Teams before you try to fix it with
  commands you found on the internet.
- Git rejects your push → `git pull --rebase` and try again.

Ask in the Teams channel, not by DM — if you hit it, four other people hit it too.
