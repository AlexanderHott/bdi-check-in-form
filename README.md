# Brandeis Design and Innovation Check-in Forms

Check in to a BDI space, allowing us to make data-driven improvements.

## Setup

- make a new google application in the google cloud console
- enable google sheets api
- create new credentials for an "application" (not user facing program)
- find email with the credentials
- create a sheet and invite the email to it
- create the tables `al-checkins`, `ml-checkins`, `dsl-checkins`, and `people` (OUTDATED, check code)
- when deploying, update `SHEET_ID`, and credentials environment variables

## Contributing

Install bun <https://bun.sh/docs/installation>

```bash
bun install
bun dev
```

## Deploying

Easiest is <https://vercel.com> or <https://www.netlify.com/>, but you can deploy anywhere with `bun run next build` or on aws with <https://sst.dev>

## Resources

- https://dev.to/ku6ryo/google-sheets-api-in-typescript-setup-and-hello-world-10oh

---

## TODO

- [ ] make email an alternative
- [ ] "thanks for checking in"
  - [ ] remember to pick up your training ID
  - [ ] check in another user
- [ ] check out / swipe out
  - [ ] email about missing / bad experience
  - [ ] 4 smiley faces

- [ ] arrow / gif for where to swipe card
- ui is 1024x600
- [x] make scroll buttons bigger
- [x] make "other" fields required
- [x] make required fields be nonempty strings

- [ ] replace redirects with 404 page + back
- [ ] move cardid to url fragment

---

on check out

check if there was a checkin thats valid
if so, redirect to

redirect + "/checkout"

- rating 1-4
- comment box

- gamify checking out specifically
