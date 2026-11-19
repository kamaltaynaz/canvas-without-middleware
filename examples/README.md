# Examples

Short, generic Apps Script files that show the **shape** of things. They are not a working tool and they are not the scripts this kit came from. Every address, ID and name in them is invented.

Give them to your agent as illustrations. It should write your version from your spec, not copy these.

| File | Shows |
|---|---|
| [`Config.gs`](Config.gs) | Settings and tokens read from Script Properties, one set per environment |
| [`CanvasApi.gs`](CanvasApi.gs) | One function that owns every request, paging, back-off, and a form-encoded call |
| [`ParseList.gs`](ParseList.gs) | Turning a cell such as `A, B,C` into a clean list, with its own test |
| [`SafeStep.gs`](SafeStep.gs) | A step that is safe to run twice, and a row runner that records evidence as it goes |
| [`PauseAndResume.gs`](PauseAndResume.gs) | Stopping before the run-time limit and continuing from a saved place |
| [`RetrySweep.gs`](RetrySweep.gs) | A timed sweep that resumes failed rows, with a lock and an attempt limit |

Check every Canvas and Apps Script call against the current documentation before relying on it.
