import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">About Company</h1>
      <p className="mt-2 text-zinc-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, exercitationem!</p>
      
      <div className="mt-8 p-12 border-2 border-dashed rounded-xl flex items-center justify-center">
        About company description
      </div>
      
      <Link href="/" className="mt-4 inline-block text-blue-600 underline">
        ← Back to Home
      </Link>
    </div>
  );
}