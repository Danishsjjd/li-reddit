import { ObjectType, Field } from "type-graphql"
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Post } from "./Post"

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  password!: string

  @Field()
  @Column({ unique: true })
  username!: string

  @Field()
  @Column({ unique: true })
  email!: string

  @OneToMany(() => Post, (photo) => photo.creator)
  posts: Post[]

  @Field()
  @CreateDateColumn()
  createdAt?: Date

  @Field()
  @UpdateDateColumn()
  updatedAt?: Date
}
