# 02. Spec: write it down before building

*Paste this when I have confirmed the summary from discovery.*

---

Turn `docs/ANSWERS.md` into a specification, `docs/SPEC.md`. Write for a colleague who has to maintain this after me and who was not in this conversation. Use plain words. Where an answer was assumed or is still open, say so in the spec at the place it matters.

## The spec must contain

1. **Purpose and scope.** What the tool does, and what it deliberately does not do. State plainly that it creates courses and does not synchronise student enrolments from a student information system, unless I asked for that.
2. **The method chosen** (bulk workbook, live form, or collect then batch), why, and what it means for tokens.
3. **The sheet layout.** Every column: its letter, name, who writes it (a person or the script), allowed values and an example.
   - Input columns are mine. Output columns are the script's and are protected.
   - One output column per step's evidence (for example the Canvas course ID), a warnings column, a last-error column, a last-completed-step column, a last-run time and a run count.
   - Any column holding IDs or numbers that may start with zero is formatted as plain text.
4. **The steps, in order.** For each: what it does in Canvas, what must be true before it, what evidence proves it is done, when it is skipped on a re-run, and whether a failure stops the row or becomes a warning.
   - **Put "apply course settings" last.** Explain why in the spec: a content copy can overwrite settings such as the time zone.
5. **Row statuses.** The small set of values in the status column, which ones the tool will process, and what each means to a person reading the sheet.
6. **Identifiers.** The exact patterns for course and section IDs, with invented examples, and the function that builds them.
7. **The write actions allowed.** A closed list (ground rule 7), each with its Canvas API call.
8. **Environments and tokens.** The Script Properties by name, one address and token per environment, the active-environment property, and where the sheet shows it.
9. **Limits.** The run-time budget and how the tool pauses and resumes. What happens when Canvas throttles.
10. **Messages.** Every email the tool can send: to whom, when, and the text. Where they go during testing.
11. **Dry run.** What it shows for one row.
12. **Reset.** What the rehearsal reset does, in which environments, and how it frees IDs for reuse.
13. **Who may do what.** Edit and view access to the sheet, and who holds the tokens.
14. **Open questions and assumptions,** each with an owner.

## Read `LESSONS.md` now

It lists things that real Canvas and real Sheets did to a tool like this one. For each lesson, add a line to the spec saying how this design handles it, or why it does not apply to me.

## Then

Show me the spec. Walk me through the sheet layout and the steps table. Ask me to approve it or change it. Do not start `03-build-core.md` until I approve.
