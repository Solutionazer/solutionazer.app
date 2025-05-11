import TeamMember from './members/team-member'

interface TeamProps {
  uuid: string
  name: string
  type?: string
  members: TeamMember[]
}

export default class Team {
  private readonly uuid: string
  private readonly name: string
  private readonly type: string | undefined
  private readonly members: TeamMember[]

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

  public getType(): string | undefined {
    return this.type
  }

  public getMembers(): TeamMember[] {
    return this.members
  }
}
