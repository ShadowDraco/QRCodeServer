# THE Free QR

[Backend](https://github.com/ShadowDraco/The-Free-QR-Backend)

A Free and open source QR code generator.
The goal is to provide QR's that never _Cost_, _Expire_, or _require_ useless information from the user.

The website has no secrets and stores no personal information. All QR's have the ability to be shown off, or left hidden.

## Features

- Easy to use
- Create QRs
- View other QRs
- Private QRs
- Search by Group-Code
- Number of scans tracking (Non-intrusive)
- Users can message for support
- QRs stored in database
- NSFW QR filtering
- (TODO) Add password for creator to edit QRs

## API Reference

#### Get all items

```http
  GET /qr/all
```

Filters out protected items before returning JSON

#### Get by group code

Gets all items with provided group code. (Includes protected items)

```http
  GET /qr/${code}
```

| Parameter | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| `code`    | `string` | **Required**. Group-Code of item to fetch |

#### Visit (Redirect)

This route runs functions on the QR with the equivalent URL parameter. Then redirects the user to said URL.

```http
  GET /qr/visit/${url}
```

| Parameter | Type     | Description                                            |
| :-------- | :------- | :----------------------------------------------------- |
| `url`     | `string` | **Required**. URI-Encoded URL to redirect the user to. |

#### Create (New QR)

Uses request body, `{ url, code, protected?, password }` to create a new QR, store it, and send it back to the user.

Does not allow NSFW urls to be created

```http
  GET /qr/create
```

| Parameter   | Type     | Description                                            |
| :---------- | :------- | :----------------------------------------------------- |
| `url`       | `string` | **Required**. URI-Encoded URL to redirect the user to. |
| `code`      | `string` | **Optional**. group code to organize related QRs.      |
| `protected` | `bool`   | **Optional**. Is this QR visible to everyone?          |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Front End
`NEXT_PUBLIC_URL` = "http://localhost:3001"
`MAILGUN_SECRET_KEY` = YOUR-MAILGUN-KEY
`MAILGUN_DOMAIN` = YOUR-MAILGUN-DOMAIN
^ Needed in production

`NEXT_PUBLIC_NEXT_URL` = "http://localhost:3000"
^ Same as `NEXT_PUBLIC_URL` in production

Backend
`URL` = "http://localhost:3001"
`PORT` = 3001
`MONGO_CONNECTION_URI` = "YOUR-MONGO-URI"

## Run Locally

Clone the project (Front and Back)

````bash
  git clone https://github.com/ShadowDraco/QRCodeFrontend

  git clone https://github.com/ShadowDraco/QRCodeServer

Go to the directories

Install dependencies

```bash
  npm install
````

Start the server

```bash
  npm run dev
```

## Support

For support, leave a message throught the website or open an issue on Github
