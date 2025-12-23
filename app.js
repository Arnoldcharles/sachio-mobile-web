import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyA59q1Xf0JqGWzNxHh0ORiXUSN5v_hvcwI',
  authDomain: 'sachio-mobile-toilets-ed86d.firebaseapp.com',
  projectId: 'sachio-mobile-toilets-ed86d',
  storageBucket: 'sachio-mobile-toilets-ed86d.appspot.com',
  messagingSenderId: '1052577492056',
  appId: '1:1052577492056:web:ab73160d1adf6186a4ae2d',
  measurementId: 'G-WSZ8JN7WNZ',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const redirectKey = 'sachio_redirect_uri';
const params = new URLSearchParams(window.location.search);
const paramRedirect = params.get('redirect_uri');
if (paramRedirect) {
  localStorage.setItem(redirectKey, paramRedirect);
}
const redirectUri =
  paramRedirect || localStorage.getItem(redirectKey) || 'sachio://auth/callback';

const statusEl = document.getElementById('status');
const button = document.getElementById('googleSignIn');

const setStatus = (text) => {
  statusEl.textContent = text || '';
};

const finishLogin = async (user) => {
  const idToken = await user.getIdToken();
  const join = redirectUri.includes('?') ? '&' : '?';
  window.location.href = `${redirectUri}${join}idToken=${encodeURIComponent(
    idToken
  )}`;
};

const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      setStatus('Returning to the app...');
      await finishLogin(result.user);
    }
  } catch (err) {
    setStatus(err?.message || 'Login failed. Try again.');
  }
};

button.addEventListener('click', async () => {
  setStatus('Opening Google...');
  button.disabled = true;
  try {
    await signInWithRedirect(auth, provider);
  } catch (err) {
    setStatus(err?.message || 'Login failed. Try again.');
    button.disabled = false;
  }
});

handleRedirectResult();
