# 06. Test, then roll out in small steps

*Paste this when the method I chose is built.*

---

## Part 1: test

Write `docs/TEST-REPORT.md` as you go. For each test: what you did, what you expected, what happened, and the evidence.

1. **Functions on their own.** The ID builder, the list parser and anything that turns sheet text into data. Include course numbers starting with zero, an empty cell, one item, two items, six items, stray spaces and a trailing comma.
2. **Each step, alone, in the test Canvas.** Run it once and confirm the result in Canvas. Run it again and confirm nothing was duplicated.
3. **Whole rows.** The five varied rows from `04-bulk-workbook.md`, or one request of each type for the live form.
4. **Interruptions.** Make a step fail in the middle of a row (an invalid user is the easy way). Confirm earlier results are kept, the error is recorded, and the next run continues from the right step without "already in use" errors.
5. **The time limit.** Set the run-time budget very low on purpose and run enough rows to trigger a pause. Confirm it resumes, finishes, and sends one summary for the whole tab.
6. **Every lesson in `LESSONS.md`.** For each, show me the test that proves this build handles it, or tell me why it does not apply.
7. **What must not happen.** Confirm the reset refuses in production. Confirm no token appears in any log or sheet. Confirm no notification reached a real person.

Tell me plainly what you could not test and why. Typical gaps: how production differs from test in speed and throttling, and email behaviour for real recipients.

## Part 2: an independent look

Ask me to have someone else read the script before production: a colleague, or a second AI agent that is given the files and the spec and told to trust neither. Give me a short brief for that reviewer: what the tool may do, what it must never do, and where a mistake would hurt most. The tool this kit came from had no such review. Yours should.

## Part 3: roll out

Do not skip a stage. Wait for my go-ahead between each.

1. **Read-only in production.** With a production token, make only read calls: confirm the accounts, the term, the roles and tool identifiers match what the spec assumes. Report differences.
2. **Dry run in production.** A dry run of the real rows. I read every line.
3. **One course.** Run one real, low-risk row. I check it in Canvas against the dry run, including its settings and time zone.
4. **A small batch.** Five to ten rows. I check them.
5. **The rest.** In batches I approve.
6. **Afterwards.** Give me a list of every course created, with its ID and link, and every warning still open. If I created a short-lived token for the run, remind me to delete it or confirm it has expired.

## If something goes wrong in production

Stop. Do not try to fix it by running more. Tell me exactly which rows were touched and what was done to each. The reset does not exist in production, so any undo is a decision for me, one course at a time.
