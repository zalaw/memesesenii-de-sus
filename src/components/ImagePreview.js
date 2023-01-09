import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar-edit";
import Modal from "./Modal";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MdOutlineRotateLeft, MdOutlineRotateRight, MdZoomOut, MdZoomIn } from "react-icons/md";
import CustomButton from "./CustomButton";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, query, updateDoc, where } from "firebase/firestore";

const ImagePreview = ({ src, handleClose }) => {
  const imgRef = useRef();

  const { currentUser, setCurrentUser } = useAuth();

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(1 / 1);
  const [loading, setLoading] = useState(false);

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 50,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function getCroppedImg() {
    setLoading(true);

    const image = imgRef.current;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const rotateRads = rotate * (Math.PI / 180);
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();
    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
    ctx.restore();

    canvas.toBlob(async blob => {
      const fileName = crypto.randomUUID();
      const storageRef = ref(storage, `avatars/${currentUser.uid}/${fileName}`);

      const { items } = await listAll(ref(storage, `avatars/${currentUser.uid}`));

      for (const item of items) {
        await deleteObject(item);
      }

      const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: blob.type });

      uploadTask.on(
        "state_changed",
        snapshot => {},
        error => {
          console.log(error);
          console.log(JSON.stringify(error, null, 2));
          setLoading(false);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);

            await updateProfile(auth.currentUser, { photoURL: url });
            await updateDoc(doc(db, "users", currentUser.firestoreId), { avatar: url, avatarFileName: fileName });

            setCurrentUser(prev => ({
              ...prev,
              photoURL: url,
            }));

            handleClose();
          } catch (err) {
            console.log(err);
          } finally {
            setLoading(false);
          }
        }
      );
    });
  }

  const onImageLoad = e => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  return (
    <Modal width={"sm:max-w-xl"}>
      <div className="select-none">
        <div className="p-2 sm:p-4 text-center">Update profile picture</div>

        <div className="bg-zinc-900 cursor-grabbing flex justify-center overflow-auto px-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={c => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop={true}
            keepSelection={true}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={src}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <div className="flex items-center p-2 sm:p-4 gap-1 sm:gap-2">
          <div
            className="text-md sm:text-2xl p-2 rounded-md hover:bg-slate-700"
            onClick={() => setRotate(prev => (prev + 90) % 360)}
          >
            <MdOutlineRotateRight />
          </div>
          <div className="w-full flex items-center gap-2 p-2">
            <div className="text-md sm:text-2xl">
              <MdZoomOut />
            </div>
            <input
              className="w-full h-1 bg-blue-500"
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={scale}
              onChange={e => setScale(e.target.value)}
            />
            <div className="text-md sm:text-2xl">
              <MdZoomIn />
            </div>
          </div>
          <div onClick={handleClose}>
            <CustomButton text="Cancel" />
          </div>
          <div>
            <CustomButton loading={loading} text="Save" primary={true} onClick={getCroppedImg} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImagePreview;
