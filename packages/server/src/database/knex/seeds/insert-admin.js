import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const { env: { ADMIN_EMAIL, ADMIN_PASSWORD } } = process
import { Admin } from '../../../models/objection'

export async function seed() {
  const admin = await Admin.query().findOne({'email': ADMIN_EMAIL})
  if (!admin) {
    return Admin.query().insert({
      email: ADMIN_EMAIL,
      password: bcrypt.hashSync(ADMIN_PASSWORD),
    })
  }
}
