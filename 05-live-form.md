# 05. The live form: a request builds a course

*Optional. Paste this only if I chose the live form in discovery, or for the form-design advice when building "collect, then batch".*

---

## Before you build, say this back to me

Tell me in your own words, and ask me to confirm that I accept each point:

- A live form needs a Canvas admin token present in the script's properties **for as long as the form is open**. It cannot be a token that exists only during a run.
- Google Forms suits **one course per submission.** Someone with five courses fills it in five times.
- If other departments act on course requests today, a form that serves only Canvas does not replace the existing one. Either this form must carry their questions too, or the existing form stays.
- The form must be limited to signed-in members of my domain, with the respondent's verified address collected, because that address decides who is enrolled as the instructor.

If I hesitate on any of these, recommend "collect, then batch" and stop.

## Build these

1. **The form, built by a script.** Write a function that creates the whole form: questions, help text, validation and branching. The form's design then lives in a file, can be reviewed, and can be rebuilt. Keep the number of questions as low as the spec allows. Ask a question once, before any branching, if every branch needs it.
2. **A column map.** One place that says which response column feeds which field. Find the response tab by its link to the form, never by its position among the tabs.
3. **The submit handler.** On submit: read the row, run the steps from the core, and write each step's evidence and the status as it goes.
4. **Checks before building.** Refuse, with a helpful reply to the requester, when the term does not exist yet or the same course has already been requested.
5. **The retry sweep.** A timed trigger that finds rows that failed, resumes each from the step after its last completed one, counts attempts, and tells me after the limit in the spec. Use a lock so a sweep and a submission cannot work on the same row together. See `examples/RetrySweep.gs`.
6. **One confirmation email** to the requester when the course is complete, with the link and any warnings in plain words. If a content copy was refused because they do not teach the source course, say so and tell them how to get permission.
7. **A message to me** on any failure that stops a request, and again when retries are exhausted.
8. **Requests for people without Canvas access.** If a request involves another team (textbooks, for example), write the details to a separate sheet shared with that team, with a status column they maintain. Do not send them Canvas links they cannot open.

## A suggestion you may offer me, clearly marked as untested

One form per course that also carries other departments' questions, feeding a master sheet. A script writes each department its own sheet with only its columns, in a shared drive, and notifies that department's contact when its sheet changes. This kit's author proposes it and has not built it. If I want it, treat it as new design work: spec it first.

## Check with me before you call it finished

- Submit one request of each type in the test Canvas and show me the courses and the emails (sent to me, not to real requesters).
- Make a step fail on purpose, show me the sheet, and show me the sweep resuming from the right step.
- Submit the same request twice and show me the second being refused.
