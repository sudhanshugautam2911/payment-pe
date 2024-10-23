# Payment-Pe (A paytm like application)

## Tech Stack
1. Frontend and Backend - Next.js (or Backend)
2. Express - Auxilary backends
3. Turborepo
4. Postgres Database
5. Prisma ORM
6. Tailwind
 
## Features

### User Login
1. Auth (In this case, probably email/phone)
2. On ramp from bank, off ramp to bank
3. Support transfers via phone number/name
4. Support scanning a QR code for transferring to merchants

### Merchant Login
1. Login with google
2. Generate a QR Code for acceptance
3. Merchants get an alert/notification on payment
4. Merchant gets money offramped to bank every 2 days

### Hot Paths 🌶️ (Paths where we need integrity, reliability and consistency)
1. Send money to someone
2. Withdraw balance of merchant
3. Withdraw balance of user back to bank
4. Webhooks from banks to transfer in money

## Architecture
![image](https://github.com/user-attachments/assets/b35ea29d-99e8-413c-9b69-a09126482466)

