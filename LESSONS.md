# Lessons from a real build

These come from building this kind of tool against a real Canvas, and from two terms of using it, about 300 courses. Give this file to your agent with `02-spec.md`. For each lesson, your spec should say how your build handles it.

Canvas and Apps Script both change. Treat each item as something to **test in your own environment**, not as a fact about yours.

| # | What happened | What to do |
|---|---|---|
| 1 | Copying content from an older course overwrote the new course's time zone with the old one's. | Apply course settings as the **last** step, after any content copy. |
| 2 | Hiding a navigation item with a JSON body did nothing and reported no error. | Send that call form-encoded. After any change, read the value back to confirm it took. |
| 3 | A custom role inherited from a parent account was not returned when listing roles from the sub-account, so it could not be found by name. | Configure the role's ID. Send both the base enrolment type and the role ID when enrolling. |
| 4 | A failure overwrote the status cell with "Error". The retry no longer knew what had succeeded, started again, and failed on "ID already in use". | Decide what is done from evidence columns. Keep a "last completed step" value that an error never overwrites. |
| 5 | A retry tried to create a section that already existed. | When Canvas says an ID is already in use, look the item up and carry on. |
| 6 | A deleted course kept its ID reserved, so a rehearsal could not be repeated. | In the rehearsal reset, rename the section IDs, then the course ID, then delete. Provide a recovery command for courses already deleted. |
| 7 | One assistant who could not be found failed the whole course. | Only the primary instructor is essential. Collect every other enrolment problem as a warning and continue. |
| 8 | Modules copied by a content migration lost their links to external tools. | When modules are wanted, leave them out of the copy and rebuild them through the API. |
| 9 | The spreadsheet stripped leading zeros from course numbers. | Format those columns as plain text. Pad in the script as a second guard. |
| 10 | The script read "the first tab" and broke when a tab was added. | Find a form's response tab by its link to the form, not by position. |
| 11 | One course in about 300 had five or six sections typed into one cell, separated by commas. They were not split as intended and its sections were not linked correctly. The cause was not confirmed. | Use one list-parsing function everywhere. Test it with one, two and six items, with and without spaces. Show the parsed list in the dry run. |

## Two lessons that are not about code

- **A course request is rarely only a Canvas request.** Where an existing form also feeds rooms, the library or other offices, a new form that serves only Canvas will not replace it. Find out before you build one.
- **A form takes one course per submission.** People with several courses will notice.
