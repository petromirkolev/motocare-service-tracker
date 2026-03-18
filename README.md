# MotoCare Jobs

MotoCare Jobs is a small motorcycle service job tracker built as a full-stack learning project focused on auth, bikes, service jobs, status transitions, and app state management.

## Current scope

The app currently supports:

- user registration and login
- auth persistence with logout
- creating and deleting bikes
- creating service jobs for a selected bike
- listing jobs for the current user
- job status transitions:
  - requested > approved
  - approved > in progress
  - in progress > done
  - requested / approved > cancelled
- persistence through SQLite

## Tech stack

- Frontend: Vite + Vanilla TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite

## Project structure

- "web/" — frontend
- "api/" — backend API
- "docs/" — screenshots / assets

## Running locally

### API

```bash
cd api
npm install
npm run dev
```

### Web

```bash
cd web
npm install
npm run dev
```

## Main entities

### User

- register
- login
- logout

### Bike

- make
- model
- year
- nickname

### Job

- bike
- service type
- odometer
- note
- status

### Current status model

- requested
- approved
- in_progress
- done
- cancelled

### Allowed transitions:

- requested > approved
- requested > cancelled
- approved > in_progress
- approved > cancelled
- in_progress > done

## Notes

This project is intentionally smaller than MotoCare and is being used to practice reusing app structure, backend/API flow, UI state handling, and controlled scope.

## Next steps

### Planned next work:

- finish MVP functionalities
- cleanup and repo hygiene
- README polish
- testing
- Docker / CI later
