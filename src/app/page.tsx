export default function Home() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  return <h1>{process.env.DATABASE_URL}</h1>;
}
