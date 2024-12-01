# API Documentation

## Overview

This repository contains a Node.js API built with Express. It provides a set of CRUD operations for managing tasks, including the ability to create, retrieve, update, and delete tasks.

### API Endpoints

- `POST /api/tasks/create` - Create a new task
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Retrieve a task by its ID
- `PUT /api/tasks/:id` - Update a task by its ID
- `DELETE /api/tasks/:id` - Delete a task by its ID

## Environment Variables

The following environment variables are required for the application to run properly:

| Variable Name      | Description                                                | Default Value |
|--------------------|------------------------------------------------------------|---------------|
| `PORT`             | Port on which the server will run.                         | `3000`        |
| `TASKS_QUEUE_URL`          | AWS SQS Task queue. | `null`   |
| `AWS_ACCESS_KEY_ID`  | AWS Access Key for authenticating the application.                   | `null`         |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key for authenticating the application.           | `null`         |
| `ENVIRONMENT`          | Running environment name. | `null`       |

### Local development

```bash
    npm install
    npm run dev
```