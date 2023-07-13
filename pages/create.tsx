import { UserContext } from '../lib/context';
import styles from '@/styles/Admin.module.css';
import ChashcinCheck from '@/components/ChashcinCheck';
import { firestore, serverTimestamp } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from '@/components/Loader';
import { useContext } from 'react';

export default function Create() {
    return (
        <main>
          <ChashcinCheck>
            <CreateNewItem />
          </ChashcinCheck>
        </main>
      );
}

function CreateNewItem() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };


    const { user } = useContext(UserContext)
    const router = useRouter();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [price, setPrice] = useState('');

      // Validate length
    const isValid = name.length > 1 && name.length < 100;

    const createItm = async (e) => {
        e.preventDefault();
        const data = {
            booked: false,
            bookedBy: null,
            bought: false,
            owned: false,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
            imgUrl: downloadURL,
            link: url,
            name: name,
            price: price
        }
        
       const ref = firestore.collection('items').doc()
       await ref.set(data)
       //router.push(`/${ref.id}`);
       router.push(`/`);
    }


    return (
        <form onSubmit={createItm}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item Name"
          className={styles.input}
        />

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          pattern="https://.*"
        />   

       <input type="number"   
               value={price}
          onChange={(e) => setPrice(e.target.value)}
       min="1" max="100000"/>

        <Loader show={uploading} />
        {uploading && <h3>{progress}%</h3>}

        {(!uploading && !downloadURL) && (
          <>
            <label className="btn">
              📸 Upload Img
              <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
            </label>
          </>
        )}

        {downloadURL && <h3>done</h3>} 

        <button type="submit" disabled={!isValid || !downloadURL} className="btn-green">
          Create
        </button>
      </form>
    ); 
}