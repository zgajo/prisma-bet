# NBA UNDER MARTINGALE

### APP SETUP:

Docker and Prisma **have to be installed** on your computer to run Prisma on Docker containers.

1. Start docker-compose.yml to setup containers to work. It can be done either in `server/prisma` folder and running `docker-compose up -d` OR from root running `npm run docker:server`
2. Setup prisma running `npm run prisma:deploy`
3. Start client and server running `npm run dev`

### LIBRARIES USED:

- **SERVER**

  1. [Prisma](https://www.prisma.io/)
  2. [Graphql yoga](https://github.com/prisma/graphql-yoga)
  3. [Docker](https://www.docker.com/)

- **CLIENT**

  1. [React](https://reactjs.org/)
  2. [Ant design](https://ant.design/)
  3. [React table](https://react-table.js.org)

- **TEST**

  1. [Jest](https://jestjs.io/)

### **SERVER**

- **Tests**  
  All test queries are run through `runQuery` function which simulates mocks our server

- **App workflow**

  - Creating new user has to be accepted by app admin. On creating new user, email is sent to app admin and when it's confirmed by him, user will receive confirmation

**CLIENT**

---
