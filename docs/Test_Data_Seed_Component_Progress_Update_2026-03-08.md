# Tennis EMS – Test Data Seed Component Progress Update

## Purpose of this file
This file is a handoff/progress note for future chats that continue the **test data seed component** work in the Tennis EMS backend.

It records:
- why the component exists,
- the current architecture after refactoring,
- which modules have already been aligned with the real Entity / DAO layer,
- what has already been generated,
- and what still needs to be checked or completed.

---

## 1) Why this component exists
The seed component was introduced to generate local development / test data **through the real Spring backend infrastructure**, instead of manually writing SQL.

The main reason is to avoid mismatches between:
- database test data,
- Java-side validation / role logic,
- and password hashing.

The agreed principle remains:
- use the real Spring context,
- use real DAO beans,
- use the real `PasswordEncoder`,
- do **not** use controller endpoints,
- do **not** replace this with raw SQL scripts.

This design direction was already documented in the earlier background note. fileciteturn11file0L36-L53 fileciteturn11file11L72-L84

---

## 2) Original structure vs current structure
### 2.1 Earlier minimal idea
The earlier agreed minimal design was:
- one DTO: `SeedResultDTO`
- one service: `DevSeedService`
- one `main`: `SeedDataMain` fileciteturn11file7L12-L19

### 2.2 Current refactored structure
Because the original all-in-one `DevSeedService` became too crowded, the seed logic has now been refactored into **module-based seed services**.

The intended structure is now:
- `SeedResultDTO`
- `SeedDataMain`
- `DevSeedService` (thin orchestrator)
- `UserSeedService`
- `CourseSeedService`
- `MatchSeedService`
- `TrainingGroupSeedService`

This is a deliberate refactor for readability and maintainability.

---

## 3) Current orchestration design
`DevSeedService` has been converted from a heavy implementation class into a thin orchestration layer that wires together the module seed services.

At the time of review, the orchestrator contains these public entry methods:
- `seedUsersOnly()`
- `seedUsersAndCourses()`
- `seedAll()` fileciteturn11file2L29-L58

The intended final orchestration flow is:
1. seed users,
2. seed course system,
3. receive course seed context containing the generated `sessionId`,
4. pass that `sessionId` into match seeding,
5. seed training groups.

Important note:
- an older snapshot still showed `seedAll()` calling `courseSeedService.seedCourseSystem(result)` and then `matchSeedService.seedMatchSystem(result)` without passing `sessionId`. fileciteturn11file2L48-L57
- during the current chat, this was redesigned so that **course seeding should directly return the seeded `sessionId`**, and match seeding should consume that `sessionId` directly.

This change was made to remove the fragile dependency on re-querying `Session` by exact `LocalDateTime`.

---

## 4) Module-by-module progress

### 4.1 User module – aligned
The user module has already been checked against the real Entity / DAO layer and was found to be **basically aligned**.

Confirmed Entity / DAO support:
- `UserDAO` provides `insert(User)` and `getByEmail(String)`.
- `AdminDAO`, `CoachDAO`, and `StudentDAO` each provide `insert(...)` and `getByUserId(int)`. fileciteturn11file7L48-L54
- `Admin` supports `setAdminLevelFromString(...)`. fileciteturn11file12L62-L81

Seed intent for the user module remains:
- create 1 Admin,
- create 1 Coach,
- create 1 Student,
- using the real `PasswordEncoder` and real DAO beans. fileciteturn11file11L16-L35

Planned sample accounts discussed in chat:
- `admin@test.com`
- `coach@test.com`
- `student@test.com`
- local password like `123456`.

Status: **UserSeedService is considered structurally stable.**

---

### 4.2 Course module – aligned with one design improvement
The course chain was reviewed against the real Entity / DAO layer and found to be **mostly aligned**, with one important design improvement.

Seed dependency chain:
- `Course`
- `Court`
- `Section`
- `Session`
- `Enrollment`
- `SessionAttendance`
- `SessionNote`
- `SessionAssessment` fileciteturn11file11L36-L53

Confirmed DAO support includes:
- `SectionDAO.getByCourseIdAndCoachIdAndName(...)` fileciteturn11file5L14-L19
- `CourtDAO.getByLocationAndName(...)` fileciteturn11file8L13-L16

Important alignment note:
- `Enrollment` and `SessionAttendance` should continue using `setStatusFromString(...)` style methods.
- The earlier draft did this correctly. fileciteturn11file18L3-L15 fileciteturn11file18L17-L36

Important redesign made in this chat:
- the earlier approach relied on querying the seeded `Session` again by exact `startTime`,
- this was considered too fragile,
- the improved design is for `CourseSeedService.seedCourseSystem(...)` to return a small context object containing at least the seeded `sessionId`,
- then `DevSeedService.seedAll()` should pass that `sessionId` directly into `MatchSeedService`.

Status: **CourseSeedService is largely aligned; the key structural improvement is direct `sessionId` handoff.**

---

### 4.3 Match module – aligned after corrections
The match system required more correction than the user/course modules, but it is now much clearer.

Planned seed dependency chain:
- `ScoringFormat`
- `TrainingMatch`
- `MatchSidePlayer`
- `MatchSummary`
- `MatchSegment` fileciteturn11file11L55-L68

Confirmed DAO support:
- `ScoringFormatDAO.getByName(...)` fileciteturn11file3L9-L19
- `MatchSummaryDAO.getByMatchId(...)` fileciteturn11file13L5-L13
- `MatchSegmentDAO.get(matchId, segmentNo)` fileciteturn11file1L9-L20

Important corrections discovered during this chat:
1. `ScoringFormat.FormatType` does **not** contain `MATCH_TIEBREAK`; the actual enum values are `POINT_RACE`, `GAME_RACE`, and `SET_MATCH`. fileciteturn11file10L7-L11
2. `MatchSummary` seed logic had to be revised to use the actual entity fields such as `finalScoreText`, `sideAScore`, and `sideBScore`, rather than nonexistent assumptions from the earlier draft. DAO support for summary lookup is present. fileciteturn11file13L5-L13
3. `MatchSegment` can safely use enum-based assignment such as `MatchSegment.SegmentType.SET`. fileciteturn11file19L7-L17 fileciteturn11file19L42-L77

A later partial snapshot of the revised `MatchSeedService` already reflects several of these fixes:
- `TrainingMatch` title/status/winnerSide are being set,
- `MatchSummary` uses `finalScoreText`, `sideAScore`, `sideBScore`,
- `MatchSegment` uses `SegmentType.SET`. fileciteturn11file15L7-L18 fileciteturn11file15L49-L68 fileciteturn11file15L71-L92

Status: **MatchSeedService has been substantially corrected and should now be aligned around direct `sessionId` input.**

---

### 4.4 Training group module – now implemented
The training group module started as a placeholder, but during this chat it was expanded into a real seed module once the relevant Entity / DAO files were provided.

Confirmed DAO support:
- `TrainingGroupDAO` supports `insert(...)`, `getAll()`, `getById(...)`, `getByType(...)`, `getActive()` etc.
- `TrainingGroupMemberDAO` supports `insert(...)` and `get(groupId, studentId)`. fileciteturn11file4L7-L24

Current intended seed logic:
- seed one `TrainingGroup`,
- then seed one `TrainingGroupMember` linking the seeded student into that group.

Because `TrainingGroupDAO` does not expose a direct `getByName(...)`, the current design choice is to:
- call `getAll()`,
- then match by group name and group type in Java.

Status: **TrainingGroupSeedService is now no longer just a placeholder; it has enough DAO support to be fully implemented.**

---

## 5) SeedResultDTO progress
The project continues to use **one shared result DTO** to accumulate counters and messages across all seed modules.

An earlier snapshot already contained grouped counters for:
- user system,
- course system,
- match system. fileciteturn11file16L8-L33

During this chat, the DTO was further extended to include training-group counters, and missing getter methods such as:
- `getTrainingGroupsCreated()`
- `getTrainingGroupMembersCreated()`
were identified and then patched in chat.

Status: **SeedResultDTO remains the single shared return object and has been expanded to cover the new training-group module.**

---

## 6) SeedDataMain progress
A dedicated non-web entry point has now been drafted.

Its intended responsibility is:
- start Spring without web server,
- get `DevSeedService` from the context,
- call `seedAll()`,
- print counters and messages,
- exit.

This remains consistent with the original design principle documented in the earlier background note. fileciteturn11file7L12-L19

Status: **SeedDataMain has been generated in chat and should now be added into the project.**

---

## 7) Current architecture snapshot
At the end of this chat, the intended seed component architecture is:

```text
SeedDataMain
    -> DevSeedService (thin orchestrator)
        -> UserSeedService
        -> CourseSeedService
        -> MatchSeedService
        -> TrainingGroupSeedService
    -> SeedResultDTO
```

And the preferred execution order is:
1. seed users,
2. seed courses and obtain `sessionId`,
3. seed matches using that `sessionId`,
4. seed training groups,
5. print `SeedResultDTO`.

---

## 8) What is already done vs what still needs checking
### Already done
- The old monolithic `DevSeedService` has been conceptually split into module-based services.
- User module was checked and considered aligned.
- Course module was checked and considered mostly aligned.
- Match module was checked and corrected against actual Entity / DAO definitions.
- Training group module now has enough DAO support to be implemented.
- `SeedResultDTO` has been expanded to cover training groups.
- `SeedDataMain` has been drafted.

### Still worth checking in the next chat
- Confirm the **actual project files** fully reflect the latest in-chat refactor, especially:
  - `DevSeedService.seedAll()` should pass `sessionId` into `MatchSeedService`.
  - `MatchSeedService` should no longer depend on re-querying the seeded session by time.
- Compile and fix any remaining import / method-signature mismatches.
- Run the seed component once end-to-end and verify all inserted data appears correctly in the database.
- Optionally add more seeded records later (more students, more matches, more groups), once the baseline path is stable.

---

## 9) Key principle for future chats
Future chats should preserve the following core principle:

> The seed component is an internal Spring-based backend utility that must reuse the project’s real DAO beans, transaction handling, and password encoder, so that generated test data behaves consistently with the real application.

This is the most important design constraint and should not be lost in later refactors. fileciteturn11file11L72-L84
