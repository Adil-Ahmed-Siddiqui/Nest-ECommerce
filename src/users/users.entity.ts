import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    BeforeInsert,
    BeforeUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
  } from 'typeorm';

import { IsString, MinLength, MaxLength, Length, IsOptional } from 'class-validator';
const bcrypt = require('bcrypt')
  
  @Entity() 
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
  
    // Email Unique constraint?
    @Column()
    email: string;
  
    @Column()
    password: string;

    @Column()
    role: string;

    @Column()
    verificationToken: string;

    @Column({nullable:true, default:false})
    isVerified: boolean;

    @Column({nullable:true, default:null})
    verified: Date;

    @Column({nullable:true, default:''})
    passwordToken: string;

    @Column({nullable:true, default:null})
    passwordTokenExpirationDate: Date;
  
    @AfterInsert()
    logInsert() {
      console.log('Inserted User with id', this.id);
    }
  
    @AfterUpdate()
    logUpdate() {
      console.log('Updated User with id', this.id);
    }
  
    @AfterRemove()
    logRemove() {
      console.log('Removed User with id', this.id);
    }
  }
