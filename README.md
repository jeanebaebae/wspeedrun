"# wspeedrun" 
## Requirements
- Node.js 22.16.0
- TypeScript 5.9.3
- MySQL
- NestJS 11
- Prisma 6.19.3

## Installation
- npm install dan npx prisma generate untuk setiap services

## Swagger
Auth Service : http://localhost:3000/api
Game Service : http://localhost:3001/api
Run Service  : http://localhost:3002/api

## Notes untuk .env
Khusus run-service, tambahkan line: 
GAME_SERVICE_URL="http://localhost:3001"


