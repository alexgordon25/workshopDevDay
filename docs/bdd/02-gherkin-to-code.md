# 02 — From Gherkin to Code

This file maps every BDD scenario to the actual code that implements it.
Use this as a learning reference to understand how behavior descriptions translate into working software.

---

## The BDD → Code Bridge

```
Gherkin Scenario       →   What it tests
─────────────────────────────────────────────────────────
Given (context)        →   Database state, auth session
When (action)          →   User interaction / API call
Then (outcome)         →   UI assertion / DB assertion
```

In our stack:
- **Database** = SQLite via Drizzle ORM (`src/server/db/schema.ts`)
- **API** = tRPC procedures (`src/server/api/routers/`)
- **Auth** = Better Auth (`src/server/better-auth/`)
- **UI** = Next.js App Router + React components (`src/app/`)

---

## US-001 & US-002 — Authentication

### Scenario: Successful registration

```gherkin
Given I am on the sign-up page
When I enter name, email, password and click "Sign Up"
Then I should be signed in and redirected to "/todos"
```

**Code path:**

1. **UI** → `src/app/sign-up/page.tsx`
   - Client component with a controlled form
   - Calls `authClient.signUp.email({ name, email, password })`

2. **Auth Client** → `src/server/better-auth/client.ts`
   ```typescript
   export const authClient = createAuthClient();
   // authClient.signUp.email() sends POST /api/auth/sign-up/email
   ```

3. **API Route** → `src/app/api/auth/[...all]/route.ts`
   ```typescript
   export const { GET, POST } = toNextJsHandler(auth.handler);
   // Catches all requests to /api/auth/*
   ```

4. **Auth Config** → `src/server/better-auth/config.ts`
   ```typescript
   emailAndPassword: { enabled: true }
   // Enables the sign-up/sign-in email handler
   ```

5. **Database** → `src/server/db/schema.ts`
   - Creates a row in the `user` table
   - Creates a row in the `account` table (with hashed password)
   - Creates a row in the `session` table

```
User fills form  →  authClient.signUp.email()
                 →  POST /api/auth/sign-up/email
                 →  better-auth validates + hashes password
                 →  inserts user + account + session to DB
                 →  returns session token
                 →  router.push("/todos")
```

---

### Scenario: Sign in with wrong password

```gherkin
When I enter wrong password
Then I should see an error message
```

**Code path:**

```typescript
// src/app/sign-in/page.tsx
const { error } = await authClient.signIn.email({ email, password });

if (error) {
  setError(error.message ?? "Failed to sign in");
  // → renders <p className="text-red-400">{error}</p>
}
```

Better Auth returns an error object when credentials are wrong. The component catches it and sets local state, which renders the error message to the user.

---

### Scenario: Authenticated user redirected from sign-in

```gherkin
Given I am already signed in
When I navigate to "/sign-in"
Then I should be redirected to "/todos"
```

**Code path:**

```typescript
// src/app/page.tsx (home page does this too)
const session = await getSession();
if (session) redirect("/todos");
```

The `/todos` page also protects itself:
```typescript
// src/app/todos/page.tsx
const session = await getSession();
if (!session) redirect("/sign-in");
```

`getSession()` is defined in `src/server/better-auth/server.ts`:
```typescript
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);
// React's `cache()` deduplicates multiple calls per request
```

---

## US-004 — Create a Todo

### Scenario: Create a todo with title and description

```gherkin
When I enter title "Buy groceries"
And I enter description "Milk, bread, eggs"
And I click "Add Todo"
Then I should see "Buy groceries" in my todo list with status "PENDING"
```

**Code path:**

1. **UI** → `src/app/_components/create-todo-form.tsx`
   ```typescript
   const create = api.todo.create.useMutation({
     onSuccess: async () => {
       await utils.todo.getAll.invalidate(); // refreshes list
       setTitle(""); setDescription("");     // clears form
     },
   });

   create.mutate({ title: "Buy groceries", description: "Milk, bread, eggs" });
   ```

2. **tRPC Router** → `src/server/api/routers/todo.ts`
   ```typescript
   create: protectedProcedure
     .input(z.object({
       title: z.string().min(1).max(256),
       description: z.string().optional(),
     }))
     .mutation(({ ctx, input }) => {
       return ctx.db.insert(todos).values({
         title: input.title,
         description: input.description,
         userId: ctx.session.user.id,  // ← ties todo to current user
         // status defaults to "PENDING" (set in schema)
       });
     }),
   ```

3. **Database Schema** → `src/server/db/schema.ts`
   ```typescript
   export const todos = sqliteTable("todo", (d) => ({
     status: d.text({ enum: ["PENDING", "IN_PROGRESS", "DONE"] })
       .notNull()
       .default("PENDING"),  // ← default status
     userId: d.text().notNull().references(() => user.id), // ← FK
     // ...
   }));
   ```

```
User submits form  →  api.todo.create.mutate({ title, description })
                   →  POST /api/trpc/todo.create
                   →  tRPC validates input with Zod
                   →  protectedProcedure checks session (throws if not logged in)
                   →  ctx.db.insert(todos) with userId from session
                   →  onSuccess: invalidate cache → re-fetches list
                   →  new todo appears in UI with status PENDING
```

---

## US-005 — View Todo List (Data Ownership)

### Scenario: Users only see their own todos

```gherkin
Given I am signed in as "daniel@example.com"
When I navigate to "/todos"
Then I should only see my own todos
```

**Code path:**

```typescript
// src/server/api/routers/todo.ts
getAll: protectedProcedure.query(({ ctx }) => {
  return ctx.db
    .select()
    .from(todos)
    .where(eq(todos.userId, ctx.session.user.id))  // ← filters by user!
    .orderBy(desc(todos.createdAt));
}),
```

The `where(eq(todos.userId, ctx.session.user.id))` clause ensures the SQL query only returns todos belonging to the authenticated user. This is the data isolation layer.

**Server-side prefetch** (for SSR performance):
```typescript
// src/app/todos/page.tsx
void api.todo.getAll.prefetch();
// → runs the query server-side
// → hydrates the React Query cache
// → client renders instantly without loading state
```

---

## US-006 — Update Todo Status

### Scenario: Move todo to IN_PROGRESS, verify blue badge

```gherkin
When I change its status to "IN_PROGRESS"
Then the badge should be displayed in blue
```

**Code path:**

1. **UI** → `src/app/_components/todo-item.tsx`
   ```typescript
   const STATUS_COLORS = {
     PENDING:     "bg-yellow-500/20 text-yellow-300",
     IN_PROGRESS: "bg-blue-500/20 text-blue-300",   // ← blue
     DONE:        "bg-green-500/20 text-green-300",
   };

   const updateStatus = api.todo.updateStatus.useMutation({
     onSuccess: () => utils.todo.getAll.invalidate(),
   });

   <select
     value={todo.status}
     onChange={(e) => updateStatus.mutate({
       id: todo.id,
       status: e.target.value as TodoStatus
     })}
   />
   ```

2. **tRPC Router** → `src/server/api/routers/todo.ts`
   ```typescript
   updateStatus: protectedProcedure
     .input(z.object({
       id: z.number(),
       status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]),
     }))
     .mutation(({ ctx, input }) => {
       return ctx.db
         .update(todos)
         .set({ status: input.status })
         .where(
           and(
             eq(todos.id, input.id),
             eq(todos.userId, ctx.session.user.id)  // ← security: own todos only
           )
         );
     }),
   ```

The `and(eq(todos.id, ...), eq(todos.userId, ...))` is critical security — it prevents a user from updating another user's todos even if they know the ID.

---

## US-007 — Delete a Todo

### Scenario: Cannot delete another user's todo

```gherkin
When I attempt to delete todo with id 42 via the API
Then the delete should fail
And alice's todo should still exist
```

**Code path:**

```typescript
// src/server/api/routers/todo.ts
delete: protectedProcedure
  .input(z.object({ id: z.number() }))
  .mutation(({ ctx, input }) => {
    return ctx.db
      .delete(todos)
      .where(
        and(
          eq(todos.id, input.id),
          eq(todos.userId, ctx.session.user.id)  // ← only deletes if owned
        )
      );
  }),
```

If Daniel tries to delete Alice's todo (id: 42), the `eq(todos.userId, ctx.session.user.id)` clause means the `WHERE id=42 AND userId=daniel_id` won't match any row. The delete runs but affects 0 rows — Alice's todo is untouched.

---

## Architecture Diagram

```
Browser (Client)
│
├── /sign-in, /sign-up        → better-auth client → POST /api/auth/*
├── /todos (page)             → Server Component → getSession() + prefetch
│   ├── <CreateTodoForm>      → api.todo.create.useMutation()
│   ├── <TodoList>            → api.todo.getAll.useSuspenseQuery()
│   │   └── <TodoItem>        → api.todo.updateStatus / api.todo.delete
│
└── /api
    ├── /auth/[...all]        → Better Auth handler (sign-in, sign-up, sign-out)
    └── /trpc/[trpc]          → tRPC handler (todo CRUD)
                                  └── createTRPCContext (session from headers)
                                       └── protectedProcedure (auth guard)
                                            └── Drizzle ORM → SQLite DB
```

---

## Key Security Patterns Demonstrated

| Pattern                    | Where                          | Protects Against          |
|----------------------------|--------------------------------|---------------------------|
| `protectedProcedure`       | All todo procedures            | Unauthenticated access    |
| `eq(todos.userId, userId)` | getAll, updateStatus, delete   | Accessing others' data    |
| Zod validation             | All procedure inputs           | Invalid/malicious input   |
| Session from server headers| `createTRPCContext`            | Client-side session spoofing |
