import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
} from 'firebase/auth'
import { auth, isFirebaseConfigured, ADMIN_UIDS } from '../firebase/config'
import { AuthContext, type AuthUser } from './AuthContext'

const LOCAL_UID_KEY = 'gse_local_uid'
const LOCAL_EMAIL_KEY = 'gse_local_email'

function makeLocalUid() {
  const uid = 'local_' + Math.random().toString(36).slice(2, 10)
  localStorage.setItem(LOCAL_UID_KEY, uid)
  return uid
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Offline local mode.
      const uid =
        localStorage.getItem(LOCAL_UID_KEY) || makeLocalUid()
      setUser({
        uid,
        email: localStorage.getItem(LOCAL_EMAIL_KEY),
        displayName: null,
        isAdmin: false,
        isAnonymous: true,
      })
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          isAdmin: ADMIN_UIDS.includes(fbUser.uid),
          isAnonymous: fbUser.isAnonymous,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const api = useMemo(
    () => ({
      user,
      loading,
      async signIn(email: string, password: string) {
        if (!isFirebaseConfigured || !auth) {
          localStorage.setItem(LOCAL_EMAIL_KEY, email)
          setUser({
            uid: localStorage.getItem(LOCAL_UID_KEY) || makeLocalUid(),
            email,
            displayName: null,
            isAdmin: ADMIN_UIDS.includes(email),
            isAnonymous: false,
          })
          return
        }
        await signInWithEmailAndPassword(auth, email, password)
      },
      async signUp(email: string, password: string) {
        if (!isFirebaseConfigured || !auth) {
          localStorage.setItem(LOCAL_EMAIL_KEY, email)
          setUser({
            uid: makeLocalUid(),
            email,
            displayName: null,
            isAdmin: false,
            isAnonymous: false,
          })
          return
        }
        await createUserWithEmailAndPassword(auth, email, password)
      },
      async signInAnon() {
        if (!isFirebaseConfigured || !auth) {
          setUser({
            uid: makeLocalUid(),
            email: null,
            displayName: null,
            isAdmin: false,
            isAnonymous: true,
          })
          return
        }
        await signInAnonymously(auth)
      },
      async signOut() {
        if (!isFirebaseConfigured || !auth) {
          localStorage.removeItem(LOCAL_UID_KEY)
          localStorage.removeItem(LOCAL_EMAIL_KEY)
          setUser(null)
          return
        }
        await fbSignOut(auth)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}
