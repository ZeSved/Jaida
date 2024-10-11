import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { deleteObject, getBlob, getStorage, listAll, ref, StorageReference, uploadBytes } from "firebase/storage";

export function upload(uid: string, data: string, doc: DocumentSnapshot<DocumentData, DocumentData> | undefined) {
  const file = new File([data], `${doc!.data()!.name}.md`)
  const storage = getStorage()
  const items: string[][] = []
  const storageRef = ref(storage, `${uid}/${doc!.data()!.displayName}-${doc!.data()!.fileId}.md`)

  const r = ref(storage, uid)

  async function list() {
    await listAll(r).then(s => {
      s.items.forEach(t => {
        items.push(t.name.split('-'))
      })
    })

    console.log(items)
    sendFile()
  }

  list()

  async function sendFile() {
    console.log(items)
    for (const i of items) {
      if (i.includes(`${doc!.data()!.fileId}.md`)) {
        if (i[0] !== doc!.data()!.displayName) {
          console.log(`deleting file ${i.join('-')}`)
          const delRef = ref(storage, `${uid}/${i.join('-')}`)

          await deleteObject(delRef).then(() => {
            console.log('file deleted')
            send(storageRef, file)
          })
          return
        }

        if (i[0] === doc!.data()!.displayName) {
          console.log('file updating')
          send(storageRef, file)
          return
        }
      }
    }
    console.log('creating file')
    send(storageRef, file)
  }
}

function send(storageRef: StorageReference, file: File) {
  uploadBytes(storageRef, file).then(s => {
    console.log(`file ${storageRef} added`, s)
  })
}

// async function blob(re: StorageReference) {
//   await getBlob(re).then((t) => {
//     console.log(t.text)
//   })
// }