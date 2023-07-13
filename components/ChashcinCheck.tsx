import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function ChashcinCheck(props) {
  const { user, chashcin } = useContext(UserContext);

  return (user && chashcin) ? props.children : props.fallback || <Link href="/error">You must be signed in</Link>;
}