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
