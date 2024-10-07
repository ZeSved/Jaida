import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  QuerySnapshot,
  setDoc,
  UpdateData,
  updateDoc,
  WithFieldValue
} from "firebase/firestore"

export const database = {
  value: {} as Promise<DocumentSnapshot<DocumentData, DocumentData>> | Promise<void> | unknown,
  target: {} as docContent,

  setTarget(target: docContent) {
    this.target = target
    return this
  },

  setDocument(data: WithFieldValue<DocumentData>, specific?: docContent): typeof this {
    getData(this)

    async function getData(t: typeof database) {
      t.value = await setDoc(specific ?? t.target, data)
    }

    return this
  },

  updateDocument(data: UpdateData<DocumentData>, specific?: docContent): typeof this {
    getData(this)

    async function getData(t: typeof database) {
      t.value = await updateDoc(specific ?? t.target, data)
    }

    return this
  },

  getDocument(specific?: docContent): typeof this {
    getData(this)

    async function getData(t: typeof database) {
      t.value = await getDoc(specific ?? t.target)
    }

    return this
  },

  getValue(): DocumentSnapshot<DocumentData, DocumentData> {
    return (this.value as DocumentSnapshot<DocumentData, DocumentData>)
  }
}

type docContent = DocumentReference<DocumentData, DocumentData>