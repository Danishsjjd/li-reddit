import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number

  @Field()
  @Property({})
  createdAt?: Date = new Date()

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date()

  @Field()
  @Property({ type: "text" })
  title!: string
}
