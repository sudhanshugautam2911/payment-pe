import { Button } from "@repo/ui/button";

import { PrismaClient } from '@Prisma/client'
const client = new PrismaClient();

export default function Home() {
  return (
    <div className="text-4xl">
      <h1>Hello</h1>
      <Button className="text-red-300" appName="Btn">Button</Button>
    </div>
  );
}
