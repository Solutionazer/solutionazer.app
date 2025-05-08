interface MemberProps {
  uuid: string
  name: string
}

export default class Member {
  private readonly uuid: string
  private readonly name: string

  constructor(private readonly props: MemberProps) {
    this.uuid = props.uuid
    this.name = props.name
  }

  public getUuid(): string {
    return this.uuid
  }

  public getName(): string {
    return this.name
  }
}
