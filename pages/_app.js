import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { UserContext, WalletContext } from '../lib/context';
import { useUserData, useWallet } from '../lib/hooks'


export default function App({ Component, pageProps }) {
    const userData = useUserData();
    const wallet = useWallet();

    return (
        <UserContext.Provider value={{ user: userData.user, chashcin: userData.chashcin}}>
            <WalletContext.Provider value={{current: wallet.current, total: wallet.total}}>
                <Navbar />
                <Component {...pageProps} />
            </WalletContext.Provider>
        </UserContext.Provider>
    );
}