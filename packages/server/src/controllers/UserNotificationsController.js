import HttpError from '../errors/http-error'
import { User } from '../models/objection'

export default {
  async set(req, res) {
    const { params: { address }, body: { disabled } } = req
    if (typeof disabled !== 'boolean') {
      const errors = [{disabled: 'request must contain a boolean "disabled" property'}]
      throw HttpError.BAD_REQUEST(errors)
    }
    const user = await User.findOne({address})
    await user.relatedUpdateOrInsert('notificationSetting', {notificationsDisabled: disabled})
    res.send({
      disabled: !!disabled
    })
  }
}
