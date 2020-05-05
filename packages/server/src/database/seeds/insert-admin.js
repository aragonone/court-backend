import dotenv from 'dotenv'
import { Admin } from '../../models/objection'

dotenv.config()
const { env: { ADMIN_EMAIL, ADMIN_PASSWORD } } = process

export async function seed() {
  const admin = await Admin.findByEmail(ADMIN_EMAIL)
  if (!admin) await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
}
