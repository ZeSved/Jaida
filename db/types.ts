import { DocumentData, DocumentSnapshot, QuerySnapshot } from "firebase/firestore";

export type Snapshot = QuerySnapshot<DocumentData, DocumentData>

// export type QSnapshot = QuerySnapshot<DocumentData, DocumentData>

export interface Folder extends Snapshot {
  id: string
  numberOfDocs: number
  name: string
  lastModified: string
}

