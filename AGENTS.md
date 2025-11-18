# **Project Context & Rules**

## **1. Project Overview**

* **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, React Flow.
* **Backend**: Python 3.11+, FastAPI, LangGraph (for AI workflows).
* **Architecture**: Monorepo style (or split frontend/ and backend/ directories).
* **Goal**: Build a scalable web application where the frontend consumes AI agent workflows exposed via FastAPI endpoints.

## **2. Global Development Principles**

* **Type Safety First**: Use TypeScript strict mode for frontend and Pydantic models for backend. Never use `any` or untyped Python dictionaries if a schema can be defined.
* **Environment**: Always run `conda activate py312` whenever a Python environment is needed.
* **Functional Programming**: Prefer functional components in React and functional endpoints/dependencies in FastAPI.
* **Documentation**: All complex logic (especially LangGraph nodes) must be documented. Use context7 for latest documentations and update the modules.
* **Async Default**: Use async/await for all I/O operations in both Python and JS.

## **3. Frontend Rules (Next.js + shadcn/ui)**

### **3.1 Architecture & Routing**

* Use the **App Router** (`app/` directory).
* **Server Components**: default to Server Components. Use "use client" only when hooks (`useState`, `useEffect`) or event listeners are strictly necessary.
* **Data Fetching**: Use Server Actions for mutations and fetch in Server Components for data retrieval. Avoid `useEffect` for data fetching.

### **3.2 UI & Styling (shadcn/ui)**

* **Component Location**: All shadcn primitives live in `components/ui`. Do not modify these files directly unless theming requires it.
* **Custom Components**: Build composite components in `components/` (e.g., `components/auth-form.tsx`) using shadcn primitives.
* **Tailwind**: Use utility classes for layout. Avoid custom CSS files (`.css`) modules.
* **Theming**: Use CSS variables for colors (`--primary`, `--destructive`) defined in `globals.css`.

### **3.3 Naming Conventions**

* **Files**: `kebab-case.tsx` (e.g., `user-profile.tsx`).
* **Components**: `PascalCase` (e.g., `UserProfile`).
* **Interfaces**: No `I` prefix. Use descriptive names (e.g., `User`, `AgentState`).

### **3.4 Visualization (React Flow)**

* **Library**: Use **React Flow** (`@xyflow/react`) for all flowchart and node-based visualizations (e.g., visualizing LangGraph execution paths).
* **Styling**: Customize nodes and handles using Tailwind CSS to match the shadcn/ui theme (e.g., use `border-primary`, `bg-background`).
* **Custom Nodes**: Register custom node types in `components/flow/` rather than inline.

## **4. Backend Rules (FastAPI + LangGraph)**

### **4.1 API Structure**

* **Router Pattern**: Split routes into modules under `app/routers/` (e.g., `app/routers/agents.py`, `app/routers/users.py`).
* **Dependency Injection**: Use `Depends()` for database sessions, auth services, and configuration.
* **Validation**: Use Pydantic models for all request bodies and response schemas.
* **Error Handling**: Raise `HTTPException` with clear detail messages.

### **4.2 LangGraph Best Practices**

* **State Definition**:
  * Use `MessagesState` for standard chat applications or define a strictly typed State using `TypedDict`/`Pydantic`.
  * Example:
    ```python
    from langgraph.graph import MessagesState
    class AgentState(MessagesState):
        context: dict
    ```

* **Nodes & Tasks**:
  * Nodes should be pure where possible. Isolate side effects (e.g., API calls) in separate nodes from logic/decision making.
  * Wrap non-deterministic operations (API calls, DB writes) in `@task` (from `langgraph.func`) to ensure **durable execution** and correct replay behavior.
  * Use `ToolNode` for executing tools to handle concurrency and error management automatically.
  * Each node function must return a dictionary representing the **updates** to the state.

* **Persistence & Memory**:
  * **Short-term (Thread)**: Use `MemorySaver` (dev) or `PostgresCheckpointer` (prod) for thread-scoped state.
  * **Long-term (Cross-thread)**: Use `Store` (e.g., `InMemoryStore`, DB-backed) for user profiles or shared knowledge.
  * **Durability**: Configure `durability="async"` (recommended) or `"sync"` for production pipelines.

* **Conditional Edges**: Use conditional edges for routing logic (e.g., `should_continue` vs `end`).

### **4.3 LangGraph Testing & Debugging**

* **Unit Test Nodes**: Test individual nodes by invoking them with a mock `state` dictionary and asserting the output.
* **Integration Tests**: Use `LangGraph`'s `stream` method to test full workflows.
* **Checkpointing**: Verify persistence using `CheckpointSaverTestInitializer` patterns if implementing custom checkpointers.

### **4.4 Python Code Style**

* Follow PEP 8.
* Use Type Hints for arguments and return values: `def process_data(data: str) -> dict:`.
* Use `black` and `isort` (or `ruff`) for formatting.

## **5. Integration Guidelines**

### **5.1 API Communication**

* **Base URL**: `/api/v1/...`
* **Streaming**: For LangGraph agent responses, use Server-Sent Events (SSE) or HTTP streaming.
  * **Backend**: `StreamingResponse` in FastAPI.
  * **Frontend**: Handle streams using standard `ReadableStream` readers or specialized hooks.

### **5.2 Environment Variables**

* **Frontend**: Access public vars via `NEXT_PUBLIC_` prefix.
* **Backend**: Use `pydantic-settings` to load `.env` files into a strongly typed `Settings` object.

## **6. Directory Structure (Reference)**

```
/
├── frontend/
│   ├── app/
│   ├── components/
│   │   ├── ui/        # shadcn primitives
│   │   ├── flow/      # React Flow custom nodes
│   │   └── ...
│   ├── lib/           # utils, api-client
│   └── public/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── graph/     # LangGraph definitions
│   │   │   ├── nodes.py
│   │   │   └── workflow.py
│   │   ├── routers/
│   │   └── schemas/   # Pydantic models
│   └── tests/
└── AGENTS.md
```

## **7. Common Commands**

* **Start Backend**: `cd backend && uvicorn app.main:app --reload`
* **Start Frontend**: `cd frontend && npm run dev`
* **Add Shadcn Component**: `cd frontend && npx shadcn-ui@latest add [component-name]`
* **Install React Flow**: `cd frontend && npm install @xyflow/react`
* **Backend Test**: `cd backend && pytest`

## **8. Checklist for New Features**

1. Define Pydantic schemas for the data.
2. Create the LangGraph workflow/nodes (if logic heavy).
3. Expose via FastAPI router.
4. Create TypeScript interface in Frontend (match Pydantic).
5. Build UI Component using shadcn primitives or React Flow nodes.
6. Connect UI to API.
