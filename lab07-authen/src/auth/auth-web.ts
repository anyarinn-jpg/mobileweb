const firebaseConfig = {
  apiKey: "AIzaSyDA0i9iMHCuF8huo8zLce4xUqzv0ITlJ6c",
  authDomain: "lab06-expense-f1744.firebaseapp.com",
  projectId: "lab06-expense-f1744",
  storageBucket: "lab06-expense-f1744.firebasestorage.app",
  messagingSenderId: "707358611735",
  appId: "1:707358611735:web:f9c6f395aa43adab353f52",
  measurementId: "G-2YM5EQ968K"
};
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { AuthUser, IAuthService, EmailPasswordCredentials,PhoneCredentials } from "./auth-interface";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged
} from "firebase/auth";


export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);


function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    phoneNumber: u.phoneNumber,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}





let verifier: RecaptchaVerifier | null = null;



// ควรมี div สำหรับ reCAPTCHA ในหน้า login สำหรับโทรศัพท์ ด้วย id="recaptcha-container"
const recaptchaContainerId: string = "recaptcha-container";


export function getRecaptchaVerifier(
  containerId: string
): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      firebaseAuth,
      containerId,
      {
        size: "invisible", // หรือ "normal"
      }
    );
  }
  return verifier;
}


export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      unsub();
      resolve(user ? mapUser(user) : null);
    });
  });
}


  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );
    return mapUser(r.user);
  }


  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }


  async logout() {
    await firebaseAuth.signOut();
  }


 async startPhoneLogin(
  creds: PhoneCredentials
): Promise<{ verificationId: string }> {

  const verifier = getRecaptchaVerifier(recaptchaContainerId);

  const confirmation = await signInWithPhoneNumber(
    firebaseAuth,
    creds.phoneNumberE164,
    verifier
  );

  return {
    verificationId: confirmation.verificationId,
  };
}


  async confirmPhoneCode(payload: {
  verificationId: string;
  verificationCode: string;
}): Promise<AuthUser> {

  const credential = PhoneAuthProvider.credential(
    payload.verificationId,
    payload.verificationCode
  );

  const r = await signInWithCredential(firebaseAuth, credential);

  return mapUser(r.user);
}


}


