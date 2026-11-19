# 01. Discovery: interview me before you write anything

*Paste this after `00-ground-rules.md` has been accepted.*

---

You are going to help me set up Canvas courses from a Google Sheet with Apps Script, and perhaps a Google Form in front of it. You know how Canvas and Google Workspace work in general. You do **not** know how mine are set up, and a tool built on guesses will be wrong in ways that are expensive to find. Interview me first.

## How to run the interview

- Ask in **rounds of at most six questions**, grouped by topic. Wait for my answers before the next round.
- Where a **read-only** Canvas call can answer a question (once a test environment and token are in place), make the call, show me what you found and ask me to confirm it.
- "I don't know" is an answer. Record it as an open question with an owner and a way to find out.
- Keep `docs/ANSWERS.md`: every question, my answer, the date, and whether it is **confirmed**, **assumed** or **open**.
- Never ask me to paste a token, password or key.
- When every topic is covered, summarise on one page, list every assumption and open question, and **stop and wait**.

## Topics and questions

### 1. Who asks for a course, and who else needs to know
- Today, how does a request for a course reach me: a form, an email, a list from the registrar, a conversation?
- **Does anyone besides me act on that request?** Rooms and furniture, the library, the office that arranges teaching assistants, the bookshop? If one request feeds several departments, a form that serves only Canvas may not replace it. Tell me now if that is the case.
- Does one person ask for several courses at once? Google Forms handles one course per submission well and several badly. Is one form per course acceptable to the people who fill it in?
- Who is allowed to request a course? How do I know a request is genuine?

### 2. My Canvas
- Which environments exist (production, test, beta)? Which may we write to? How often are test and beta refreshed from production, and what happens to our rehearsal courses then?
- Where do new courses belong in the account tree? Are there separate places for term courses and for sandboxes? Which accounts must the tool never write to?
- How are terms identified, and who creates them? Must a term exist before a course is created in it?
- **Write down the exact naming and ID pattern for courses and sections, with an example.** Do other systems depend on those IDs? What breaks, and for whom, if one is wrong?
- When several sections of a course exist, are they one shared Canvas course or one course each? Who decides, per course? What must the tool do when nobody has decided?
- What time zone should new courses use? What other settings must every new course have?
- Which roles will the tool assign, including custom ones? Which must it never assign?

### 3. People
- What identifies a person in the request (a login ID, an email, a staff number), and how do I find the matching Canvas user from it? What happens when there is no match, or more than one?
- Which enrolments are essential (without them the course is pointless) and which are nice to have?
- How should "instructor not yet known" be written in the sheet, and what should the tool do with it?
- Should Canvas send its own notification emails on enrolment, or should the tool send one confirmation at the end?

### 4. Content and tools
- Do requests include "copy from an earlier course"? Who may copy from which course? Must the requester be a teacher in the source course? Who can override that, and how is the override recorded?
- Which content is copied, and which must not be (settings, dates, announcements)?
- Which external tools are switched on per course (textbook platforms, a grading tool, a discussion tool)? How is each identified in my Canvas? Which appear as navigation items and which as items inside a module?
- Does anyone outside Canvas need to be told when a tool or textbook is requested? How, given they may have no Canvas access?

### 5. My Google Workspace
- Which account will own the sheet and the script? What happens to them if that person leaves?
- Who needs to edit the sheet, and who only to read it? (See ground rule 12.)
- Which limits apply to my account type: the longest a script may run, daily quotas for web requests and email? Check the current documentation and tell me the figures you find and where you found them.
- May scripts in my domain call outside web addresses and send email? Is there an approval process for a script that does?

### 6. Tokens, and which method that points to
- Who can create a Canvas token with the needed rights, for each environment? Can it be given an expiry date?
- Does my institution's policy allow an admin token to sit in a script's properties all year? If not, the always-on form is ruled out and we build the batch method.
- How will I rotate a token, and how will I know one is about to expire?

### 7. How I want to run it
Explain these three to me in plain words, with what each demands, and ask which I want:

1. **Bulk workbook.** I fill rows in a sheet and run them from a menu. A token is needed only during a run.
2. **Live form.** A form submission builds the course at once. A token must be present all the time.
3. **Collect, then batch.** A form collects requests into the sheet with no token present. I run them together as in method 1.

Then ask: how many courses per term, when do requests arrive, and what should happen when a request is incomplete?

## When you are done

Summarise, list assumptions and open questions, recommend a method with your reason, and stop. Do not start `02-spec.md` until I say so.
