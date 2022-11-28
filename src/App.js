import { useEffect, useState } from 'react';
import './App.css';
import { auth, db, storage } from './firebase-config';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  getDocs, 
  collection, 
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "firebase/storage";
function App() {
  const [user, setUser] = useState({})
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");
  const [newEditContent, setNewEditContent] = useState("");
    
  const statusCollectionRef = collection(db, "status")
  
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([])
  const imageListRef = ref(storage, "images/");

  useEffect(() => {
    /** */
    onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); })
    
    /** */
    const getStatus= async() => {
      const data = await getDocs(statusCollectionRef);
      setStatuses(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }
    getStatus();
    
    /** */
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev => [...prev, url]));
          
        })
      })
    })
  }, [])

  // console.log(imageList)

  const createUser = async () => {
    try {
      const data = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      console.log(data)
    }catch (err) {
      console.error(err.message);
    }
  }

  const logIn = async () => {
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      console.log(data)
    } catch(err) {
      console.error(err.message);
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch(err) {
      console.error(err.message);
    }
  }

  const createStatus = async () => {
    await addDoc(statusCollectionRef, {content: newStatus, image: imageList})
    uploadImage();
  }

  const deleteStatus = async (id) => {
    const statusDoc = doc(db, "status", id);
    await deleteDoc(statusDoc);
  }

  const updateStatus = async (id, content) => {
    const statusDoc = doc(db, "status", id)
    const newFileds = {content : content};
    await updateDoc(statusDoc, newFileds);
    setEdit("");
  }

  const uploadImage = async () => {
    if(imageUpload == null) return;

    const imageRef = ref(storage, `images/${imageUpload.name}`);

    try {
      await uploadBytes(imageRef, imageUpload);

    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="App">
      <div className="user-info">
        <span>
          <i class="fa-solid fa-user"></i>
          {user?.email}
        <button className="logout-btn" onClick={logOut}><i class="fa-solid fa-right-from-bracket"></i></button>
        </span>
      </div>
      <div className="user">
        <div className="create">
          <h1>Create User</h1>
          <div className="create-inputs">
            <input 
              type="text" 
              placeholder="Email..."
              onChange={(e) => {setNewEmail(e.target.value)}}  
            />
            <input 
              type="text" 
              placeholder="Password..."
              onChange={(e) => {setNewPassword(e.target.value)}}
            />
            <button className="create-btn" onClick={createUser}>Create</button>

          </div>
        </div>
        <div className="login">
          <h1>Log In</h1>
          <div className="login-inputs">
            <input 
              type="text" 
              placeholder="Email..."
              onChange={(e) => {setEmail(e.target.value)}}  
            />
            <input 
              type="text" 
              placeholder="Password..."
              onChange={(e) => {setPassword(e.target.value)}}
            />
            <button className="create-btn" onClick={logIn}>Log in</button>
          </div>
        </div>

      </div>

      <div className="status">
        <h1>Status</h1>
        <hr/>
        <div className="list-status">
          {statuses.map(sta => {return (
            <div className="list-item" key={sta.id}>
              <span className="user-icon">
                <i class="fa-solid fa-user"></i>
              </span>
              <div className="list-item-content">
                <p>{user?.email}</p>
                {edit ? "" : <p>{sta.content}</p>}
                {sta.image ? <img src={sta.image} /> : "" }
                {edit === sta.id 
                ? <div>
                  <input 
                    defaultValue={sta.content} 
                    onChange={(e) => setNewEditContent(e.target.value)}
                  />
                  <button onClick={() => {updateStatus(sta.id, newEditContent)}}>Update</button>
                </div> 
                : ""}
              </div>
              <div className="edit-btns">
                <button onClick={() => deleteStatus(sta.id)} style={{color: "red"}}><i class="fa-solid fa-trash"></i></button>
                <button onClick={() => setEdit(sta.id)} style={{color: "green"}}><i class="fa-solid fa-pen-to-square"></i></button>
                
              </div>
            </div>
          )})}
        </div>

        <div className="your-status">
          <input
            placeholder="Your status..."
            maxLength={140}
            onChange={(e) => {setNewStatus(e.target.value)}}
            />
          <input 
            type="file" 
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
          <button 
            className="create-btn"
            onClick={createStatus}
          > Create status</button>
        </div>
      </div>

    </div>
  );
}

export default App;
