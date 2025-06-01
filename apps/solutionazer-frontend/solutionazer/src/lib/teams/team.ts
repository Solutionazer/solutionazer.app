/* eslint-disable @typescript-eslint/no-explicit-any */

import TeamMember from './members/team-member'

interface TeamProps {
  uuid: string
  name: string
  type?: string
  members: TeamMember[]
  owner?: any
}

export default class Team {
  private readonly uuid: string
  private readonly name: string
  private readonly type: string | undefined
  private readonly members: TeamMember[]
  private readonly owner: any | undefined

  constructor(private readonly props: TeamProps) {
    this.uuid = props.uuid
    this.name = props.name
    this.type = props.type
    this.members = props.members
    this.owner = props.owner
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

  public getOwner(): any | undefined {
    return this.owner
  }
}
