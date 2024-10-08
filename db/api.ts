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
  value: {} as Promise<docContent | void> | docContent,
  target: {} as docRef,

  setTarget(target: docRef) {
    this.target = target
    return this
  },

  setDocument(data: WithFieldValue<DocumentData>, specific?: docRef): typeof this {
    getData<Promise<void>>(this)

    async function getData<T>(t: typeof database) {
      await setDoc(specific ?? t.target, data).then(d => {
        (t.value as T) = d as T
      }).catch(e => { return null })
    }

    return this
  },

  updateDocument(data: UpdateData<DocumentData>, specific?: docRef): typeof this {
    getData<Promise<void>>(this)

    async function getData<T>(t: typeof database) {
      await updateDoc(specific ?? t.target, data).then(d => {
        (t.value as T) = d as T
      }).catch(e => { return null })
    }

    return this
  },

  async getDocument(specific?: docRef) {
    const t = { ...this }
    console.log(1, this.value)
    await getDoc(specific ?? t.target).then(d => {
      console.log(2, t.value);
      (t.value as docContent) = { ...d } as docContent
      console.log(3, t.value)
      console.log(t)
      return { t: t, val: d }
    }).catch(e => { return null })

    // return { t: t, val: t.value }
    // async function getData<T>() {
    // }
    console.log(88, t, this)

    // return (async () => await getData<Promise<docContent>>())()
    // console.log(4, this.value)

    // return this
    // return this
  },

  getValue(): typeof this | any {
    console.log(51, this.value)
    // arguments.callee.caller.name
    // setTimeout(() => {
    if ((this.value as docContent).ref) {
      console.log(52, this.value)
      const returnedObject: docContent = (this.value as docContent)
      console.log(53, returnedObject)

      return returnedObject as docContent
    } else return undefined
    // }, 5000)

    // console.log(5, this.value)
  }
}

type docContent = DocumentSnapshot<DocumentData, DocumentData>
type docRef = DocumentReference<DocumentData, DocumentData>