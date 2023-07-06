import { FirestoreDataConverter, FieldValue } from 'firebase-admin/firestore'
import { db } from './firestore'

type Location = {
  lat: number
  lng: number
  address: string
}

export type User = {
  id: string
  /**
   * User が現在興味を持っているキーワード
   * 現在地周辺でスポット検索する際に利用する
   * キーワードを更新するときは過去のキーワードをすべて上書きする
   * カンマ区切りの文字列で保存する
   */
  keywords?: string
  location?: Location
  updatedAt: Date
}
const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User) => {
    return {
      id: user.id,
      location: user.location,
      keywords: user.keywords,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data()
    return {
      id: data.id,
      location: data.location,
      keywords: data.keywords,
      updatedAt: data.updatedAt.toDate(),
    }
  },
}

const userCollection = db.collection('users').withConverter(userConverter)

export async function getUser(id: string): Promise<User | null> {
  const snapshot = await userCollection.doc(id).get()
  if (!snapshot.exists) {
    return null
  }

  return snapshot.data() || null
}

export async function upsertUser(
  id: string,
  User: Partial<Pick<User, 'keywords' | 'location'>>
): Promise<User | null> {
  await userCollection.doc(id).set({ ...User, id }, { merge: true })
  return await getUser(id)
}

export async function deleteUser(id: string) {
  await userCollection.doc(id).delete()
}
