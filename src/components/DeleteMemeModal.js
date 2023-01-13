import React, { useState } from "react";
import Modal from "./Modal";
import { MdClose } from "react-icons/md";
import CustomButton from "./CustomButton";
import CustomAlert from "./CustomAlert";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { arrayRemove, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useMemes } from "../contexts/MemesContext";

const DeleteMemeModal = ({ meme, handleClose }) => {
  const { currentUser } = useAuth();
  const { setMemes } = useMemes();

  const [deleteMessage, setDeleteMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    setDeleteMessage(null);
    setLoading(true);

    try {
      const memeRef = ref(storage, `memes/${meme.memeFileName}`);
      const postedMeme = currentUser.postedMemes.find(x => x.name === meme.memeFileName);

      await deleteObject(memeRef);
      await deleteDoc(doc(db, "memes", meme.id));
      await setDoc(doc(db, "users", currentUser.uid), { postedMemes: arrayRemove(postedMeme) }, { merge: true });

      setMemes(prev => prev.filter(x => x.id !== meme.id));
      handleClose();
    } catch (err) {
      setDeleteMessage({ type: "error", title: "Deletion failed", body: "yoou" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <div className="flex flex-col gap-8 py-6 sm:py-10">
        <div className="flex items-start px-6 sm:px-10">
          <div className="flex-1">
            <h2 className="antialiased font-sans font-medium text-lg sm:text-2xl leading-8 dark:text-slate-100 text-slate-900">
              Delte meme
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

        {deleteMessage && (
          <div className="px-6 sm:px-10">
            <CustomAlert type={deleteMessage.type} title={deleteMessage.title} body={deleteMessage.body} />
          </div>
        )}

        <div className="w-full px-6 sm:px-10 relative">
          <div className="display-img-container rounded-md w-full  dark:bg-zinc-900 bg-slate-200">
            <div className="">
              <img src={meme.url} alt="Meme" />
            </div>
          </div>
        </div>

        <div className="w-full px-6 sm:px-10">
          <form onSubmit={onSubmit}>
            <CustomButton
              className="danger-button w-full bg-red-700 font-semibold hover:bg-red-500 dark:hover:bg-red-500"
              loading={loading}
              type="submit"
              text="Delete"
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteMemeModal;
