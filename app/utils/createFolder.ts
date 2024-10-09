import { db } from "@/db/firebase"
import { UserInfo } from "firebase/auth"
import { doc, DocumentReference, DocumentData, setDoc, updateDoc } from "firebase/firestore"
import { User } from "next-auth"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import ShortUniqueId from "short-unique-id"

export function createDocument(currentUser: UserInfo) {
  const { getDay, getMonth, getFullYear, getHours, getMinutes } = new Date()

  const userDocument = doc(db, 'users', currentUser!.uid, 'user-documents', `_sub_folders_`)

  createNewDoc(userDocument)

  async function createNewDoc(
    userDocument: DocumentReference<DocumentData, DocumentData>
  ) {

    const subFolderId = new ShortUniqueId({ length: 9 }).rnd()

    const newSubFolder = {
      id: subFolderId,
      numberOfDocs: 9,
      numberOfFolders: 3,
      name: 'test',
      lastModified: `${getDay()}/${getMonth()}/${getFullYear()} ${getHours()}:${getMinutes()}`
    }

    await updateDoc(userDocument, { [subFolderId]: newSubFolder })
  }
}