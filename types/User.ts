export default class User {
  tenantId: string
  apiKey: string
  name: string
  createdAt: string
  lastUsedAt: string

  constructor(
    tenantId: string,
    apiKey: string,
    name: string,
    createdAt: string,
    lastUsedAt: string
  ) {
    this.tenantId = tenantId
    this.apiKey = apiKey
    this.name = name
    this.createdAt = createdAt
    this.lastUsedAt = lastUsedAt
  }
}
