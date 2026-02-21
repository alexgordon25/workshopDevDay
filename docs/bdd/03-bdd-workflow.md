# 03 — BDD Workflow: From Idea to Implementation

This file documents the development workflow used in this project, based on the
[ronnycoding/.claude](https://github.com/ronnycoding/.claude) BDD strategy.

---

## The Three-Phase Workflow

```
Phase 1 → /user-story   Write BDD user story with Gherkin scenarios
Phase 2 → /issue        Decompose into sub-issues with story points
Phase 3 → /task         Assign to agents / implement
```

### Phase 1: `/user-story` — Define Behavior

Before writing any code, write a user story that answers three questions:

- **Who** needs this? (the user/role)
- **What** do they need? (the goal)
- **Why** do they need it? (the business value)

Then write Gherkin scenarios for each behavior:

```gherkin
Feature: Create Todo
  As a signed-in user
  I want to create a new todo
  So that I can track a task

  Scenario: Happy path
    Given I am signed in
    When I enter a title and click "Add Todo"
    Then the todo appears in my list with status PENDING
```

**Output:** A `docs/bdd/01-user-stories.md` file (like this project has).

---

### Phase 2: `/issue` — Break Down Into Tasks

Decompose the user story into concrete engineering tasks using **Fibonacci story points**:

```
US-004: Create a Todo (total: 3 points)
│
├── [1pt] Add todos table to database schema
├── [1pt] Create tRPC todo router with create procedure
└── [1pt] Build CreateTodoForm component
```

Each sub-issue gets:
- A clear title (imperative: "Add todos table...")
- Acceptance criteria (directly from Gherkin `Then` clauses)
- Story point estimate
- Dependencies (what must be done first)

**Dependency ordering:**
```
Schema  →  Router  →  UI components  →  Page integration
  1pt       1pt           2pt                 1pt
```

---

### Phase 3: `/task` — Implement

With issues defined, implementation happens in order of dependencies:

```
1. Database layer  (schema.ts)
2. API layer       (routers/todo.ts)
3. UI layer        (components, pages)
4. Integration     (wire everything together)
```

---

## How This Project Was Built (BDD Applied)

### Step 1: Identified Features from User Needs

Instead of jumping to code, we started with what the user needs:

```
"I need a TODO app where I can:
  - Register and sign in
  - Create todos with a title and description
  - Track status: PENDING → IN PROGRESS → DONE
  - Delete todos I no longer need"
```

### Step 2: Wrote User Stories

Each need became a user story (see `01-user-stories.md`):

```
US-001  User Registration       3 pts
US-002  User Sign In            3 pts
US-003  User Sign Out           1 pt
US-004  Create a Todo           3 pts
US-005  View Todo List          2 pts
US-006  Update Todo Status      3 pts
US-007  Delete a Todo           2 pts
────────────────────────────────
Total                          17 pts
```

### Step 3: Wrote Scenarios for Each Story

For US-006 (Update Status), we identified 4 behaviors:
1. PENDING → IN_PROGRESS (happy path)
2. IN_PROGRESS → DONE (completion)
3. DONE → PENDING (reversal)
4. Status persists after page refresh

Each scenario became a **test case** in our minds before we wrote the feature.

### Step 4: Implemented Bottom-Up

```
1. Database:   Added `todos` table with status enum
2. API:        Created tRPC router with getAll/create/updateStatus/delete
3. Components: CreateTodoForm, TodoItem, TodoList
4. Pages:      /todos page with auth guard
5. Auth UI:    /sign-in and /sign-up pages
6. Home:       Redirect to /todos if authenticated
```

### Step 5: Verified Against Scenarios

After implementation, each scenario can be manually verified:

```
✅ US-001: Can register at /sign-up, get redirected to /todos
✅ US-002: Can sign in at /sign-in with correct credentials
✅ US-002: Wrong password shows error message
✅ US-003: Sign out redirects to /sign-in, /todos becomes inaccessible
✅ US-004: Create todo → appears in list with PENDING badge
✅ US-005: Empty state shows message when no todos
✅ US-006: Status dropdown changes badge color (yellow/blue/green)
✅ US-006: DONE status adds strikethrough to title
✅ US-007: Delete removes todo from list instantly
```

---

## Semantic Versioning in BDD

BDD stories are tied to version bumps:

| Change Type      | Version Bump | Example                          |
|------------------|--------------|----------------------------------|
| New feature      | Minor (1.**1**.0) | Adding the todo feature     |
| Bug fix          | Patch (1.0.**1**) | Fixing status not persisting |
| Breaking change  | Major (**2**.0.0) | Changing the auth system    |

This project started at `1.0.0` with the full initial feature set.

---

## BDD Anti-Patterns to Avoid

### ❌ Implementation-Focused Scenarios

```gherkin
# BAD - describes HOW, not WHAT
When I click the button with class "btn-primary" and id="submit-todo"
Then the POST request to /api/trpc/todo.create should return 200
```

```gherkin
# GOOD - describes behavior
When I click "Add Todo"
Then the new todo should appear in my list
```

### ❌ Testing One Scenario Multiple Ways

```gherkin
# BAD - redundant scenarios
Scenario: Create todo successfully (test 1)
Scenario: Create todo successfully (test 2)
Scenario: Create todo successfully (test 3)
```

Each scenario should test a **distinct** behavior or edge case.

### ❌ Vague Outcomes

```gherkin
# BAD - what does "works" mean?
Then the todo should work
```

```gherkin
# GOOD - specific, verifiable
Then I should see "Buy groceries" in my list
And its status badge should display "Pending" in yellow
```

---

## What Comes Next (Future Stories)

If this app were to grow, the next user stories might be:

```
US-008  Filter todos by status (PENDING / IN_PROGRESS / DONE)    3 pts
US-009  Search todos by title                                     2 pts
US-010  Edit todo title or description                            3 pts
US-011  Due dates on todos with overdue highlighting              5 pts
US-012  Todo categories / tags                                    8 pts
US-013  Share a todo list with another user                      13 pts
```

Each would follow the same BDD workflow:
1. Write user story + Gherkin scenarios
2. Decompose into sub-issues
3. Implement in dependency order
4. Verify against scenarios

---

## Resources

- [BDD in Action (book)](https://www.manning.com/books/bdd-in-action)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [ronnycoding/.claude workflow](https://github.com/ronnycoding/.claude)
- [Cucumber (BDD framework)](https://cucumber.io/)
- [Behave (Python BDD)](https://behave.readthedocs.io/)
