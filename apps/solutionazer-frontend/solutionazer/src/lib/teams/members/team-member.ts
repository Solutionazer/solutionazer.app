interface TeamMemberProps {
  uuid: string
  fullName: string
  email: string
}

export default class TeamMember {
  private readonly uuid: string
  private readonly fullName: string
  private readonly email: string

  constructor(private readonly props: TeamMemberProps) {
    this.uuid = props.uuid
    this.fullName = props.fullName
    this.email = props.email
  }

  public getUuid(): string {
    return this.uuid
  }

  public getFullName(): string {
    return this.fullName
  }

  public getEmail(): string {
    return this.email
  }
}
