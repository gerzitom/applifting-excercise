export default class LocalUser {
  apiKey: string
  username: string

  constructor(apiKey: string, username: string) {
    this.apiKey = apiKey
    this.username = username
  }
}
