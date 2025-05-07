# Notes App - Backend Practice Project


## Backend paths

The api paths are in `backend/controllers` folder and they are in `frontend/services` folder as well.

* Notes
    * GET `api/notes/`
    * GET `api/notes/:id`
    * POST `api/notes/`
    * DELETE `api/notes/:id`
    * PUT `api/notes/:id`

* Users
    * POST `/api/users/`
    * GET `/api/users/`

* Login
    * POST `/api/login`

## Dev

> Create the `.env` file and fill in the data according to the `example.env` file.

Run at the same time:

In *frontend* folder:

```bash
npm run dev
```

In *backend* folder:

```bash
npm run start
```

For run backend test:
```bash
cd backend
npm run test
```

---

[From Fullstackopen](https://fullstackopen.com/en/)