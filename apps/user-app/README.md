## Getting Started

Run postgres locally using docker

```bash
docker pull postgres
docker run
--name postgres
-p 5433:5432
-e POSTGRES_PASSWORD="mysecretpassword"    # default postgres password
-d                                         # detached mode
postgres
```

Generate prisma client and synn with db using migrate

```bash 
npx prisma migrate dev --name init  # it will migrate and also generate client, dev means development mode and given name to migration as init
```

Try login and check user in postgres
```bash
docker exec -it container_kill /bin/bash
psql -U postgres                         # psql is command-line tool for interacting with PostgreSQL (database)
SELECT * FROM "User";

or

npx prisma studio
```