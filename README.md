# RESTful API for Scrummy Poker

## Quick Start

```bash
git clone
```

```bash
cd scrummy-api
```

```bash
npm install
```

```bash
npm run dev
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
PORT=3030
SOCKET_PORT=3333

MONGODB_URL=mongodb+srv://userdb:scrumpokerpass@cluster0.ha53h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

JWT_ACCESS_EXPIRATION_MINUTES=4320
JWT_REFRESH_EXPIRATION_DAYS=4320
JWT_SECRET=thisisasamplesecret

SMTP_PORT=587
EMAIL_FROM=pearl.sipes63@ethereal.email
SMTP_HOST=smtp.ethereal.email
SMTP_PASSWORD=Y6TmKJP4YnzVChrVBV
SMTP_USERNAME=pearl.sipes63@ethereal.email
```

## Source Boilerplate
https://github.com/hagopj13/node-express-boilerplate.git

## License

[MIT](LICENSE)
