# 03. Build the core: configuration, the Canvas calls and the steps

*Paste this when I have approved the spec.*

---

Build the parts every method shares. Work in small pieces. After each piece: show me what you wrote, run its test, add a changelog line, and wait for my go-ahead before the next.

## How we work in Apps Script

- The script is bound to the sheet (**Extensions → Apps Script**). Keep one file per concern, as below. Tell me exactly which files to create and what to paste, or use `clasp` if I have it set up. Ask me which.
- Keep a copy of every script file in a folder I can put under version control. The script editor is not a backup.
- Nothing institution-specific is hard-coded in the step files. Addresses, tokens, account identifiers, role IDs and the time zone are read from Script Properties through one configuration file.
- Every function that calls Canvas logs a tagged line (`[Step3] Row 12: ...`). Logs never contain a token or a full request header.

## Pieces, in order

1. **Configuration.** Read settings from Script Properties, by environment. Fail with a clear message naming the missing property. A function that reports which environment is active and whether its token is set, without ever returning the token. See `examples/Config.gs`.
2. **The Canvas calls.** One file that owns every web request:
   - a single low-level function that adds the token, sets the method and body, and turns a failure into an error naming the call and the status code;
   - a function that follows paging until there are no more pages;
   - back-off and a few retries when Canvas says slow down;
   - **named functions for each allowed write action and nothing more** (ground rule 7).
   See `examples/CanvasApi.gs`. Check the current Canvas API documentation for each call you use and tell me anything you could not verify.
3. **Identifier builder.** Functions that build course and section IDs from the row, with tests using invented examples from the spec, including a course with no section and a course number that starts with zero.
4. **List parsing.** One function that turns a cell such as `A, B,C` into a clean list, used everywhere a cell holds several values. Test it with one item, two, six, extra spaces, a trailing comma and an empty cell. See `examples/ParseList.gs`.
5. **The steps,** one file each, in the order in the spec. Each step:
   - takes the row's data and the evidence already recorded;
   - checks whether its result already exists and skips if so;
   - does one thing;
   - returns its evidence and any warnings;
   - treats "already exists" from Canvas as a reason to look the thing up.
   See `examples/SafeStep.gs`.
6. **Dry run.** For a row, produce the list of actions each step would take, with the IDs it would use and the parsed lists, and call nothing.

## Rules for this stage

- Point at the **test or beta** Canvas only. Before the first write, show me the active environment and ask.
- Create one rehearsal course by hand through the steps, one step at a time, and show me the course in Canvas after each.
- Enrol with notifications off.
- If a Canvas call behaves differently from the documentation, stop, tell me, and add it to `LESSONS.md` in my copy.

## When you are done

Give me: the file list, what each test covers and its result, what you verified in the test Canvas and what you could not, and the changelog. Then stop. Next is `04-bulk-workbook.md`, or `05-live-form.md` if I chose the live form.
