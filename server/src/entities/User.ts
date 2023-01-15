import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number

  @Field()
  @Property({})
  createdAt?: Date = new Date()

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date()

  @Property({ type: "text" })
  password!: string

  @Field()
  @Property({ type: "text", unique: true })
  username!: string
}
