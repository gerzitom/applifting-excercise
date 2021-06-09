import Comment from '~/types/Comment'

export default class WebsocketMessage {
  changeType: string
  comment: Comment

  constructor(changeType: string, comment: Comment) {
    this.changeType = changeType
    this.comment = comment
  }
}
