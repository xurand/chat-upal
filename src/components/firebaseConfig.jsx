import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
 
const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };