import app from "./app.ts";

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
  console.log("Server running http://localhost:" + port);
  console.log(`Docs are available at http://localhost:${port}/docs`);
});
