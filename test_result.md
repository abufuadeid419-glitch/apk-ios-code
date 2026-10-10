#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Redesign the whole mobile UI to match the reference image (dark-navy curved
  top bar with pill-shaped tabs inside, soft blue-white content area, coral
  round action buttons, rounded avatar list rows), remove any user-facing
  "Convex" developer artefacts, and store the developer phone number hashed
  (never plaintext in env or code). Arabic RTL stays as-is.

backend:
  - task: "Hash developer phone — DEVELOPER_PHONES_HASH"
    implemented: true
    working: "NA"
    file: "/app/frontend/convex/edge.ts"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          Added `hashPhone(phone)` helper (sha256(OTP_PEPPER:phone)). `openSession`
          now reads `DEVELOPER_PHONES_HASH` (comma-separated hex sha256) and
          promotes the user to DEVELOPER only when the hash of their verified
          phone matches. Convex env `DEVELOPER_PHONES` has been removed and
          `DEVELOPER_PHONES_HASH` set to the hash of the current developer phone
          (deployed to fearless-ostrich-878). Needs backend retest: existing
          seeded DEVELOPER token (`test_token_dev`) should still work via
          /api/auth/me because the role was persisted on the user row; verifying
          the hash promotion path requires a real OTP (not automatable).

frontend:
  - task: "UI redesign — dark navy header, coral CTAs, rounded rows"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/ui.tsx, /app/frontend/src/theme.ts, /app/frontend/src/components/AccountButton.tsx, NotificationBell.tsx, SyncBadge.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          Theme: added `accent`/`onAccent` (coral #F2545B) and `headerDeep` /
          `onHeaderDeep` tokens for both light and dark schemes; new radius.xl.
          UI kit:
            - Btn primary now coral with pill shape + soft coral shadow; added
              `navy` variant for the old brandPrimary pills.
            - Header rewritten: dark navy with large curved bottom corners,
              centered white title, optional `onBack` prop (chevron pill), new
              `tabs/tabValue/onTabChange` props for pill-shaped segmented tabs
              INSIDE the dark area.
            - New `HeaderIconBtn` and `FAB` components.
            - Row component now supports `avatarText`/`avatarTone` for pastel
              circular avatars; cleaner divider; subtle pressed state.
            - Card: softer shadow, radius.lg, no border on light.
            - Stat: softer tile with pastel icon chip.
            - Badge/Section: refined.
          Header-right slots updated: NotificationBell + SyncBadge rendered as
          deep-navy pills with white icons; AccountButton is now a compact coral
          initials circle. Reports/legal/upgrade/agents-map screens migrated to
          the new `onBack` prop.
          _layout.tsx: StatusBar switched to `light` for the new dark header.
          Verified visually (login screen before/after and legal screen).
  - task: "Remove user-facing 'Convex' labels + dev artefacts"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/convex-check.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          Stripped every user-visible "Convex" string and raw function labels
          like "(stats.overview)" / "products.list · حيّ" from the diagnostic
          dashboard. Developer comments in TypeScript source still mention
          Convex as the backend provider — not user-visible.

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 4
  run_ui: true

test_plan:
  current_focus:
    - "Hash developer phone — DEVELOPER_PHONES_HASH"
    - "UI redesign — dark navy header, coral CTAs, rounded rows"
    - "Remove user-facing 'Convex' labels + dev artefacts"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Three changes to validate:
      (1) Backend: developer identification now uses hashed phone comparison
          (`DEVELOPER_PHONES_HASH` env var). Confirm `/api/auth/me` with
          `test_token_dev` still returns role=DEVELOPER (the role is persisted
          on the users row from the original seed); confirm `DEVELOPER_PHONES`
          is no longer referenced. All other APIs should be unaffected.
      (2) Frontend redesign: validate the new dark-navy curved header with
          centered title, back-button pill, coral primary CTAs with pill shape,
          and rounded list rows render across login, legal, upgrade, reports,
          activate, consent, and the owner/acct/agent dashboards. Nothing in
          the UI should still say "Convex" to the user.
      (3) Prefer visual + snapshot checks on web preview. Seeded tokens:
          test_token_owner/_acct/_agent/_dev (see /app/memory/test_credentials.md).
