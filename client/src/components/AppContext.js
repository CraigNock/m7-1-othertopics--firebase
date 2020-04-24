import React, { createContext, useEffect, useState } from 'react';

import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase';
import 'firebase/auth';


export const AppContext = createContext(null);


var firebaseConfig = {
  apiKey: "AIzaSyATQbZFuSfA5390WOGhPkZb-Y-1DcGaREs",
  authDomain: "user-app-91910.firebaseapp.com",
  databaseURL: "https://user-app-91910.firebaseio.com",
  projectId: "user-app-91910",
  storageBucket: "user-app-91910.appspot.com",
  messagingSenderId: "549696872611",
  appId: "1:549696872611:web:f1364ed0f82339c4269f16"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};


const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState('');

  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };

  useEffect(() => {
    if (user) {
      fetch('/user', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user])

  return (
    <AppContext.Provider value={{ appUser, signInWithGoogle, handleSignOut, message }}>
      {children}
    </AppContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AppProvider);
