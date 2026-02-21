# 00 — What is BDD (Behavior-Driven Development)?

## Definition

**Behavior-Driven Development (BDD)** is a software development methodology that bridges the gap between technical teams (developers, QA) and non-technical stakeholders (product managers, clients) by describing software behavior in a shared, human-readable language.

BDD extends **TDD (Test-Driven Development)** by focusing on *behavior* rather than just *tests*. Instead of asking "does the code work?", BDD asks **"does the software do what the user needs?"**

---

## Core Idea: The Three Amigos

BDD works best when three roles collaborate before writing a single line of code:

```
👤 Product Owner  →  defines WHAT is needed (business value)
🧪 QA Engineer    →  defines HOW to verify it (acceptance criteria)
💻 Developer      →  defines HOW to build it (implementation)
```

This conversation happens around **User Stories** and **Scenarios** — before implementation begins.

---

## The Gherkin Language

BDD uses a structured language called **Gherkin** to write scenarios. It uses plain English keywords so anyone can read and understand them.

### Core Keywords

| Keyword      | Purpose                                                    |
|--------------|------------------------------------------------------------|
| `Feature`    | High-level description of a feature or capability          |
| `Scenario`   | A concrete example of a specific behavior                  |
| `Given`      | The initial context / preconditions                        |
| `When`       | The action or event that triggers the behavior             |
| `Then`       | The expected outcome / result                              |
| `And`        | Continues a Given/When/Then chain                          |
| `But`        | Negative continuation (e.g., "But I should NOT see...")    |

### Basic Template

```gherkin
Feature: [Short feature name]
  As a [role]
  I want [goal]
  So that [benefit]

  Scenario: [Specific situation]
    Given [initial state]
    When [action taken]
    Then [expected outcome]
```

### Real Example

```gherkin
Feature: User Login
  As a registered user
  I want to log in with my email and password
  So that I can access my personal todos

  Scenario: Successful login
    Given I am on the sign-in page
    And I have a registered account with email "user@example.com"
    When I enter email "user@example.com"
    And I enter password "mypassword"
    And I click "Sign In"
    Then I should be redirected to the todos page
    And I should see a welcome message with my name
```

---

## BDD vs TDD vs Traditional Development

| Approach          | Starts With          | Focuses On              | Who Writes It        |
|-------------------|----------------------|-------------------------|----------------------|
| Traditional       | Code                 | Making it work          | Developer            |
| TDD               | Unit tests           | Code correctness        | Developer            |
| **BDD**           | **User behavior**    | **Business value**      | **Team together**    |

---

## Why BDD?

### ✅ Benefits

1. **Shared understanding** — Everyone agrees on what "done" means before building
2. **Living documentation** — Scenarios stay up-to-date because they're tied to code
3. **Catches wrong assumptions early** — You discover misunderstandings in planning, not production
4. **Testable requirements** — Scenarios become automated acceptance tests
5. **Confidence in changes** — Refactoring is safer when behavior is documented

### ⚠️ Common Pitfalls

1. **Gherkin as test scripts** — Scenarios should describe BEHAVIOR, not implementation steps
2. **Too technical** — "When I click button with id='submit'" (bad) vs "When I submit the form" (good)
3. **Too many scenarios** — Each scenario should test one specific behavior
4. **Skipping the conversation** — BDD without collaboration is just documentation

---

## BDD Workflow (from ronnycoding/.claude)

The workflow from the reference repository follows three phases:

```
Phase 1: /user-story  →  Write the BDD user story with Gherkin scenarios
Phase 2: /issue       →  Break down into sub-issues with story points
Phase 3: /task        →  Assign to agents for parallel implementation
```

### Story Points (Fibonacci Sequence)

Complexity is estimated using the Fibonacci sequence — not time:

```
1  = Trivial (a config change)
2  = Simple (a small component)
3  = Medium (a CRUD route)
5  = Complex (a feature with multiple interactions)
8  = Very complex (requires design decisions)
13 = Large (should be split into sub-stories)
21 = Epic (definitely needs to be split)
```

---

## BDD in This Project

In this TODO app, we applied BDD to define:

1. **Authentication** — Register and sign in with email/password
2. **Todo Management** — Create, view, update status, delete todos

See the next files for the full user stories and scenario mapping:

- `01-user-stories.md` — All Gherkin feature files
- `02-gherkin-to-code.md` — How each scenario maps to actual code
