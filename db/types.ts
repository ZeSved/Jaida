import { DocumentData, DocumentSnapshot, QuerySnapshot } from "firebase/firestore";

type DocSnapshot = DocumentSnapshot<DocumentData, DocumentData>

export type QSnapshot = QuerySnapshot<DocumentData, DocumentData>

export interface Folder extends DocSnapshot {
  id: string
  numberOfDocs: number
  name: string
  lastModified: string
}

