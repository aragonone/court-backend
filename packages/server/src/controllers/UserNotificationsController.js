import HttpError from '../errors/http-error'
import { Users } from '../models/objection'

export default {
  async set(req, res) {
    const { params: { address }, body: { disabled } } = req
    if (typeof disabled !== 'boolean') {
      const errors = [{disabled: 'request must contain a boolean "disabled" property'}]
      throw HttpError.BAD_REQUEST(errors)
    }
    const user = await Users.query().findOne({address})
    await user.$relatedUpdateOrInsert('notificationSettings', {notificationsDisabled: disabled})
    res.send({
      disabled: !!disabled
    })
  }
}
