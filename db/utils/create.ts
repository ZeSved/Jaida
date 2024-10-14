import { folderIds } from "@/constants/folderIds"
import { db } from "@/db/firebase"
import { UserInfo } from "firebase/auth"
import { doc, DocumentReference, DocumentData, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import ShortUniqueId from "short-unique-id"

export function createDocument(currentUser: UserInfo, router: AppRouterInstance) {
  const id = crypto.randomUUID()

  const userDocument = doc(db, folderIds.users, currentUser!.uid, folderIds.userDocuments, `DOC-${id}`)
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
      dateModified: time(),
    })

    await setDoc(docContent, {
      name: 'PAGE-1',
      content: [''],
    })

    await updateDoc(doc(db, folderIds.users, currentUser.uid), {
      numberOfDocuments: ((
        await getDoc(doc(db, folderIds.users, currentUser.uid))
      ).data()!.numberOfDocuments += 1),
    })
  }
}


export function createFolder(path: string[]) {
  const userDocument = doc(db, path.join('/'), '_sub_folders_')
  console.log(path)

  createNewDoc(userDocument)

  async function createNewDoc(
    userDocument: DocumentReference<DocumentData, DocumentData>
  ) {

    const subFolderId = new ShortUniqueId({ length: 9 }).rnd()

    const newSubFolder = {
      id: `F-${subFolderId}`,
      numberOfDocs: 9,
      numberOfFolders: 3,
      name: 'test',
      lastModified: time()
    }

    await updateDoc(userDocument, { [subFolderId]: newSubFolder })

    await setDoc(doc(userDocument, `F-${subFolderId}`, folderIds.subFolders), {})
  }
}

function time() {
  const date = new Date()
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}