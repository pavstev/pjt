import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to My Docs</h1>
      <Link href="/docs">Go to Docs</Link>
    </div>
  );
}