import React, { useState, useRef } from "react";
import Modal from "./Modal";
import { MdClose } from "react-icons/md";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import CustomAlert from "./CustomAlert";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  FieldValue,
  Firestore,
  getDoc,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useMemes } from "../contexts/MemesContext";

const AddMemeModal = ({ handleClose }) => {
  const [imageMessage, setImageMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(10);

  const { currentUser, setCurrentUser } = useAuth();
  const { addMeme } = useMemes();

  const fileRef = useRef(null);

  const onSelectFile = e => {
    setImageMessage(null);

    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    if (file.size > 5242880) {
      return setImageMessage({ type: "error", title: "Max size exceeded", body: "Size cannot exceed 5MB" });
    }

    setImage(file);
  };

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);

    const fileName = crypto.randomUUID();
    const storageRef = ref(storage, `memes/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
        setPercent(progress);
      },
      error => {
        console.log(error);
        setLoading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const createdAt = serverTimestamp();

          const newDocRef = await addDoc(collection(db, "memes"), {
            url: downloadURL,
            createdAt: createdAt,
            userId: currentUser.uid,
            memeFileName: fileName,
            user: doc(db, `users/${currentUser.uid}`),
          });

          await setDoc(
            doc(db, "users", currentUser.uid),
            { postedMemes: arrayUnion({ ref: doc(db, `memes/${newDocRef.id}`), name: fileName }) },
            { merge: true }
          );

          const newDoc = await getDoc(newDocRef);

          addMeme({
            id: newDoc.id,
            createdAt: newDoc.data().createdAt,
            memeFileName: fileName,
            url: downloadURL,
            userId: currentUser.uid,
            user: doc(db, "users", currentUser.uid),
            userData: { displayName: currentUser.displayName, photoURL: currentUser.photoURL },
          });

          setCurrentUser(prev => ({ ...prev, postedMemes: [fileName, ...prev.postedMemes] }));

          setLoading(false);

          handleClose();
        } catch (err) {
          setLoading(false);
          console.log(err);
        }
      }
    );
  };

  return (
    <Modal>
      <div className="flex flex-col gap-8 py-6 sm:py-10">
        <div className="flex items-start px-6 sm:px-10">
          <div className="flex-1">
            <h2 className="antialiased font-sans font-medium text-lg sm:text-2xl leading-8 dark:text-slate-100 text-slate-900">
              Add your juicy meme
            </h2>
          </div>

          <button
            tabIndex={0}
            onClick={handleClose}
            className="dark:hover:bg-zinc-700 hover:bg-slate-200 text-xl p-2 cursor-pointer"
          >
            <MdClose />
          </button>
        </div>

        {imageMessage && (
          <div className="px-6 sm:px-10">
            <CustomAlert type={imageMessage.type} title={imageMessage.title} body={imageMessage.body} />
          </div>
        )}

        <div className="w-full px-6 sm:px-10 relative">
          <div className="flex items-center justify-center display-img-container rounded-md w-full aspect-square dark:bg-zinc-900 bg-slate-200">
            {!image && <p className="absolute top-4">Max size allowed: 5MB</p>}
            <div className="w-0 h-0 hidden">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                ref={fileRef}
                onChange={onSelectFile}
              />
            </div>
            <div className="upload-btn z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CustomButton text="Upload image" primary={true} onClick={() => fileRef.current.click()} />
            </div>
            {image && (
              <div className="">
                <img src={URL.createObjectURL(image)} alt="Meme" />
              </div>
            )}
          </div>
        </div>

        {/* {image && (
          <div className="w-full px-6 sm:px-10">
            <div className=" flex items-center justify-center w-full aspect-square rounded-md dark:bg-zinc-900 bg-slate-200">
              <img src={URL.createObjectURL(image)} alt="Meme" />
            </div>
          </div>
        )} */}

        {loading && (
          <div className="w-full px-6 sm:px-10">
            <div className="h-2 dark:bg-zinc-900 bg-slate-200 rounded-full relative overflow-hidden">
              <div className="bg-green-700 absolute inset-0" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        )}

        <div className="w-full px-6 sm:px-10">
          <form onSubmit={onSubmit}>
            <CustomButton
              loading={loading}
              type="submit"
              disabled={!image}
              className="w-full"
              text="Post"
              primary={true}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddMemeModal;
