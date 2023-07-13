import Link from "next/link";
import {firestore} from '../lib/firebase';
import { useContext } from 'react';
import { UserContext, WalletContext } from '../lib/context';

export default function ItemShowcase({ items }) {
    return items ? items.map((item) => <ItemCard item={item} key={item.id} />) : null;
}

function ItemCard({item}) {
    const { current } = useContext(WalletContext)
    const { user, chashcin } = useContext(UserContext)

    const BuyItem = async () => {
        const ref = firestore.collection('chashcins').doc('wallet');
        await ref.update({"current": current - item.price, "bought": true})

        const item_ref = firestore.collection('items').doc(item.id)
        await item_ref.update({"bought": true})

        window.location.reload();
      };

    const BookItem = async () => {
        const ref = firestore.collection('items').doc(item.id)
        await ref.update({"booked": true, "bookedBy": { "name" : user.displayName, "uid" : user.uid }})

        window.location.reload();
    }

    const UnBookItem = async () => {
        const ref = firestore.collection('items').doc(item.id)
        await ref.update({"booked": false, "bookedBy": null})

        window.location.reload();
    }

    return (
        <div className="card">
            <Link href={item.link}>
                <img
                     width="200" 
                     height="auto"
                    src={item?.imgUrl || '/hacker.png'} />
            </Link>
            <br/>
            <strong className='push-left'>{item.name}</strong>
            <br/>
            {(user && chashcin) && (
                <>
                    <span className='push-left'>{item.price}</span>
                    <br/>
                </>
            )}
            {(user && chashcin) && (
                <button className="btn-green" disabled={current - item.price < 0} onClick={BuyItem}> Buy</button>
            )}
            {((user && !chashcin) && !item.booked) && (
                <button className="btn-green" onClick={BookItem}> Book</button>
            )}
            {((user && !chashcin) && (item.booked && item.bookedBy.uid != user.uid)) && (
                <strong className='push-left'>Booked by {item.bookedBy.name}</strong>
            )}
            {((user && !chashcin) && (item.booked && item.bookedBy.uid == user.uid)) && (
                <button className="btn-green" onClick={UnBookItem}> UnBook</button>
            )}
        </div>
    )
}
  