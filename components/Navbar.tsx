import Link from 'next/link'
import { auth, googleAuthProvider } from '../lib/firebase';
import { useContext } from 'react';
import { UserContext, WalletContext } from '../lib/context';

// Sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
      await auth.signInWithPopup(googleAuthProvider);
    };
  
    return (
        <button className="btn-blue" onClick={signInWithGoogle}>
          Log In
        </button>
    );
  }
  
  // Sign out button
  function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Log Out</button>;
  }

export default function Navbar() {
    const { user, chashcin } = useContext(UserContext)
    const { current } = useContext(WalletContext)

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">ChaShop</button>
                    </Link>
                </li>


                {(user && chashcin) && (
                    <>
                        <li className="push-left">
                            <button className="btn-green">{current} 🌲</button>
                        </li>
                        <li>
                            <Link href="/create">
                                <button className="btn-green">Item</button>
                            </Link>
                        </li>

                    </>
                )}

                {user && (
                    <li>
                        <SignOutButton />
                    </li>
                )}

                {!user && (
                    <li className="push-left">
                        <SignInButton />
                    </li>
                )}

            </ul>
        </nav>
    )
}