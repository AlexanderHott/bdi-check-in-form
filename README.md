# Brandeis Design and Innovation Check-in Forms

Check in to a BDI space, allowing us to make data-driven improvements.

## Setup

- make a new google application in the google cloud console
- enable google sheets api
- create new credentials for an "application" (not user facing program)
- find email with the credentials
- create a sheet and invite the email to it
- create the tables `ml-checkins`, `al-checkins`, and `people`
- when deploying, update SHEET_ID, and credentials environment variables

## Contributing

Install bun <https://bun.sh/docs/installation>

```
bun install
bun dev
```

## Deploying

Easiest is <https://vercel.com>, but you can deploy anywhere with `bun run next build` or on aws with <https://sst.dev>


## Resources

- https://dev.to/ku6ryo/google-sheets-api-in-typescript-setup-and-hello-world-10oh


--- 

# TODO

- [x] update demographics page
- [ ] make loading pages better / show up
- [ ] check out / swipe out
- [ ] add "Hello $user" to check in page
- [x] make sure card number start with `603305`

- [ ] make design responsive for smaller screens
- [ ] page after done signing in for extra info + button for "next sign in"
  - [ ] email about missing / bad experience

- [ ] arrow / gif for where to swipe card
- [ ] make email an alternative

- [ ] configure timeouts for each form page to be a bit longer
- [ ] add a submit new form button on each page
