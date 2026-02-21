# 01 — User Stories (BDD / Gherkin)

This file contains the full BDD user stories for the TODO app, written in Gherkin syntax.
Each story follows the format from [ronnycoding/.claude](https://github.com/ronnycoding/.claude).

---

## Story Points Reference

```
Story Points  Complexity
──────────────────────────
1             Trivial
2             Simple
3             Medium
5             Complex
8             Very Complex
```

---

## US-001 — User Registration

**Story Points:** 3
**Version:** 1.0.0 (minor bump — new feature)

```gherkin
Feature: User Registration
  As a new visitor
  I want to create an account with my name, email, and password
  So that I can access the TODO application and manage my tasks

  Scenario: Successful registration with valid credentials
    Given I am on the sign-up page at "/sign-up"
    When I enter my name "Daniel Gordon"
    And I enter my email "daniel@example.com"
    And I enter my password "securepassword123"
    And I click "Sign Up"
    Then I should be automatically signed in
    And I should be redirected to "/todos"
    And I should see a welcome message "Welcome, Daniel Gordon"

  Scenario: Registration fails when email is already taken
    Given I am on the sign-up page
    And a user with email "daniel@example.com" already exists
    When I enter name "Another Person"
    And I enter email "daniel@example.com"
    And I enter password "password123"
    And I click "Sign Up"
    Then I should stay on the sign-up page
    And I should see an error message indicating the email is already in use

  Scenario: Registration fails when required fields are empty
    Given I am on the sign-up page
    When I leave the name field empty
    And I click "Sign Up"
    Then the form should not submit
    And I should see a validation error on the name field
```

---

## US-002 — User Sign In

**Story Points:** 3
**Version:** 1.0.0

```gherkin
Feature: User Sign In
  As a registered user
  I want to sign in with my email and password
  So that I can access my personal todo list

  Scenario: Successful sign in with correct credentials
    Given I am on the sign-in page at "/sign-in"
    And I have a registered account with email "daniel@example.com"
    When I enter email "daniel@example.com"
    And I enter password "securepassword123"
    And I click "Sign In"
    Then I should be redirected to "/todos"
    And I should see my personal todo list

  Scenario: Sign in fails with wrong password
    Given I am on the sign-in page
    And I have a registered account with email "daniel@example.com"
    When I enter email "daniel@example.com"
    And I enter an incorrect password "wrongpassword"
    And I click "Sign In"
    Then I should stay on the sign-in page
    And I should see an error message indicating invalid credentials

  Scenario: Sign in fails with unregistered email
    Given I am on the sign-in page
    When I enter email "notregistered@example.com"
    And I enter password "somepassword"
    And I click "Sign In"
    Then I should stay on the sign-in page
    And I should see an error message

  Scenario: Authenticated user is redirected away from sign-in
    Given I am already signed in
    When I navigate to "/sign-in"
    Then I should be automatically redirected to "/todos"
```

---

## US-003 — User Sign Out

**Story Points:** 1
**Version:** 1.0.0

```gherkin
Feature: User Sign Out
  As a signed-in user
  I want to sign out of my account
  So that my session is terminated and my data stays private

  Scenario: Successful sign out
    Given I am signed in as "daniel@example.com"
    And I am on the todos page "/todos"
    When I click "Sign out"
    Then my session should be destroyed
    And I should be redirected to "/sign-in"

  Scenario: Accessing protected pages after sign out
    Given I have just signed out
    When I navigate to "/todos"
    Then I should be redirected to "/sign-in"
```

---

## US-004 — Create a Todo

**Story Points:** 3
**Version:** 1.0.0

```gherkin
Feature: Create Todo
  As a signed-in user
  I want to create a new todo with a title and optional description
  So that I can track a new task

  Scenario: Create a todo with title only
    Given I am signed in and on the todos page
    When I enter title "Buy groceries"
    And I leave the description empty
    And I click "Add Todo"
    Then I should see "Buy groceries" in my todo list
    And its status should be "PENDING"
    And the description should be empty

  Scenario: Create a todo with title and description
    Given I am signed in and on the todos page
    When I enter title "Buy groceries"
    And I enter description "Milk, bread, eggs, and coffee"
    And I click "Add Todo"
    Then I should see "Buy groceries" in my todo list
    And its description should show "Milk, bread, eggs, and coffee"
    And its status should be "PENDING"

  Scenario: Cannot create a todo with an empty title
    Given I am signed in and on the todos page
    When I leave the title empty
    And I click "Add Todo"
    Then the form should not submit
    And no new todo should be created

  Scenario: Form clears after successful creation
    Given I am signed in and on the todos page
    When I create a todo with title "Buy groceries"
    Then the title input should be empty
    And the description input should be empty
```

---

## US-005 — View Todo List

**Story Points:** 2
**Version:** 1.0.0

```gherkin
Feature: View Todo List
  As a signed-in user
  I want to see all my todos
  So that I have an overview of my tasks

  Scenario: View todos when I have tasks
    Given I am signed in as "daniel@example.com"
    And I have 3 todos: "Buy groceries", "Call dentist", "Read book"
    When I navigate to "/todos"
    Then I should see all 3 todos listed
    And each todo should show its title, description, and status badge

  Scenario: View empty state when no todos exist
    Given I am signed in as "daniel@example.com"
    And I have no todos
    When I navigate to "/todos"
    Then I should see the message "No todos yet. Add one above!"

  Scenario: Todos are private — users only see their own
    Given I am signed in as "daniel@example.com"
    And another user "alice@example.com" has 5 todos
    When I navigate to "/todos"
    Then I should not see alice's todos
    And I should only see my own todos
```

---

## US-006 — Update Todo Status

**Story Points:** 3
**Version:** 1.0.0

```gherkin
Feature: Update Todo Status
  As a signed-in user
  I want to change the status of a todo
  So that I can track progress through PENDING → IN PROGRESS → DONE

  Scenario: Move a todo from PENDING to IN PROGRESS
    Given I am signed in and on the todos page
    And I have a todo "Buy groceries" with status "PENDING"
    When I change its status to "IN_PROGRESS"
    Then the todo "Buy groceries" should show status badge "In Progress"
    And the badge should be displayed in blue

  Scenario: Move a todo from IN PROGRESS to DONE
    Given I am signed in and on the todos page
    And I have a todo "Buy groceries" with status "IN_PROGRESS"
    When I change its status to "DONE"
    Then the todo "Buy groceries" should show status badge "Done"
    And the badge should be displayed in green
    And the title should appear with strikethrough styling

  Scenario: Move a todo back from DONE to PENDING
    Given I am signed in and on the todos page
    And I have a todo "Buy groceries" with status "DONE"
    When I change its status to "PENDING"
    Then the todo "Buy groceries" should show status badge "Pending"
    And the title strikethrough should be removed

  Scenario: Status change is persisted
    Given I changed the status of "Buy groceries" to "DONE"
    When I refresh the page
    Then "Buy groceries" should still show status "DONE"
```

---

## US-007 — Delete a Todo

**Story Points:** 2
**Version:** 1.0.0

```gherkin
Feature: Delete Todo
  As a signed-in user
  I want to delete a todo
  So that I can remove tasks I no longer need

  Scenario: Delete a todo
    Given I am signed in and on the todos page
    And I have a todo "Buy groceries"
    When I click "Delete" on "Buy groceries"
    Then "Buy groceries" should no longer appear in my todo list

  Scenario: Cannot delete another user's todo
    Given I am signed in as "daniel@example.com"
    And "alice@example.com" has a todo with id 42
    When I attempt to delete todo with id 42 via the API
    Then the delete should fail
    And alice's todo should still exist
```

---

## Summary Table

| Story | Feature                | Points | Status    |
|-------|------------------------|--------|-----------|
| US-001 | User Registration     | 3      | ✅ Done   |
| US-002 | User Sign In          | 3      | ✅ Done   |
| US-003 | User Sign Out         | 1      | ✅ Done   |
| US-004 | Create Todo           | 3      | ✅ Done   |
| US-005 | View Todo List        | 2      | ✅ Done   |
| US-006 | Update Todo Status    | 3      | ✅ Done   |
| US-007 | Delete Todo           | 2      | ✅ Done   |
| **Total** |                   | **17** |           |
