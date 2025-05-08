import Member from './members/member'

interface TeamProps {
  uuid: string
  name: string
  type: string
  members: Member[]
}

export default class Team {
  private readonly uuid: string
  private readonly name: string
  private readonly type: string
  private readonly members: Member[]

  constructor(private readonly props: TeamProps) {
    this.uuid = props.uuid
    this.name = props.name
    this.type = props.type
    this.members = props.members
  }

  public getUuid(): string {
    return this.uuid
  }

  public getName(): string {
    return this.name
  }

  public getType(): string {
    return this.type
  }

  public getMembers(): Member[] {
    return this.members
  }
}
