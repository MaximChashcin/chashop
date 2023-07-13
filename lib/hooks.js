import {auth, firestore} from './firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [chashcin, setChashcin] = useState(false);

    useEffect( () => {
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = firestore.collection('chashcins').doc(user.uid);

            ref.get()
                .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        ref.onSnapshot((doc) => {
                            setChashcin(true);
                        });
                    } else {
                        setChashcin(false);
                    }
                });

        } else {
            setChashcin(false);
        }
    
        return unsubscribe;
      }, [user]);

  
    return {user, chashcin};
  }

export function useWallet() {
    const [current, setCurrent] = useState(false);
    const [total, setTotal] = useState(false);

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;

        const ref = firestore.collection('chashcins').doc('wallet');

        unsubscribe = ref.onSnapshot((doc) => {
            setCurrent(doc.data()?.current);
            setTotal(doc.data()?.total)
        });

        return unsubscribe;
    });

    return {current, total}
}