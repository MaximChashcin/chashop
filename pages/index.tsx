import { itemToJSON, firestore } from "@/lib/firebase";
import ItemShowcase from "@/components/ItemShowcase";
import Link from "next/link";
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export async function getServerSideProps() {
    const itemsQuery = firestore
        .collectionGroup('items')
        .where('bought', '==', false)
        .where('owned', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(100)

    const items = (await itemsQuery.get()).docs.map(itemToJSON)

    return {
        props: { items }, // will be passed to the page component as props
   };
}

export default function Home(props) {
    const { user, chashcin } = useContext(UserContext)

    return (
        <main>
            <ItemShowcase items={props.items} />

            {(user && chashcin) && (
            <Link href={"create"}>
                <button className="btn">+</button>
            </Link>
            )}

        </main>
    ); 
}