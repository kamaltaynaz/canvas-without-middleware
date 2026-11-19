# 07. Operate: each term, and when things change

*Paste this after the first successful production run.*

---

Write `docs/RUNBOOK.md` for the person who runs this next term. It may be me in six months, having forgotten everything. Use numbered steps and plain words.

## The runbook must cover

1. **Starting a term.** Create the tab, confirm the term exists in Canvas, confirm which environment is active, create or check the token.
2. **A normal run.** Fill rows, dry run, read it, run, read the summary, deal with warnings.
3. **Late information.** How to add an instructor, a tool or a copy source to a finished row and re-run only that.
4. **Tokens.** Which Script Property holds which token. How to create one with an expiry. How to replace one. For the bulk method: create before the run, remove after. For the live form: the rotation schedule, and what requesters see if the token has expired.
5. **Rehearsing a new term** in test or beta, and resetting afterwards.
6. **When a run stops.** What "paused" means and what to do (usually nothing). What to do when a run fails outright. Where the logs are.
7. **Reading an error.** The ten most likely error messages, what each means and what to do.
8. **Who has access.** Who may edit the sheet and why. How to remove someone. What to do when the sheet's owner leaves the institution.
9. **Changing the tool.** Where the script's files are kept under version control, how a change is tested in beta first, and how the changelog is kept.
10. **What this tool does not do,** so nobody assumes it does.

## Checks to schedule

- A reminder before each term to rehearse in beta, since Canvas and Apps Script both change.
- For the live form: a weekly check that the sweep trigger still exists and the token is valid. Triggers can be removed without notice when an account changes.
- A yearly review of who can edit the sheet.

## When Canvas or Google changes something

If a call starts behaving differently, stop using the tool in production, reproduce the problem in test, fix it there, and add what you learned to `LESSONS.md`.

## Finally

Hand me the runbook, the final file list, the changelog, and a list of every assumption that is still unconfirmed.
