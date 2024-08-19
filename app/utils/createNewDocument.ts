import { db } from "@/firebase/firebase"
import { User } from "firebase/auth"
import { doc, DocumentReference, DocumentData, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { NextRouter } from "next/router"

export function createNewDocument(currentUser: User, router: AppRouterInstance) {
  const id = crypto.randomUUID()

  const userDocument = doc(db, 'users', currentUser!.uid, 'user-documents', `DOC-${id}`)
  const docContent = doc(userDocument, 'pages', 'PAGE-1')

  router.push(`/m/DOC-${id}`)

  createNewDoc(userDocument, id, docContent)

  async function createNewDoc(
    userDocument: DocumentReference<DocumentData, DocumentData>,
    id: string,
    docContent: DocumentReference<DocumentData, DocumentData>
  ) {
    // const amountOfDocs =
    // 	(await getDocs(collection(db, 'users', currentUser!.uid, 'user-documents'))).size + 1

    if (!window.location.pathname.includes(`m`))
      setTimeout(() => createNewDoc(userDocument, id, docContent), 100)

    await setDoc(userDocument, {
      name: `DOC-${id}`,
      displayName: 'New document',
      numberOfPages: 1,
      dateOfCreation: new Date(),
    })

    await setDoc(docContent, {
      name: 'PAGE-1',
      content: [''],
    })

    await updateDoc(doc(db, 'users', currentUser.uid), {
      numberOfDocuments: ((
        await getDoc(doc(db, 'users', currentUser.uid))
      ).data()!.numberOfDocuments += 1),
    })
  }
}