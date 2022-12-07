import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { Project, TProjectGroupDocument, User, TUserDocument } from '@/schemas';


@Injectable()
export class ProjectsHelperService {


  constructor(

  ) {}


  async hasAccessToProjectGroupOrFail(
    user: TUserDocument, 
    project_group: TProjectGroupDocument,
  ): Promise<void> {
    
    if(project_group.user !== user.id) {
      throw new InvalidInputException('ACCESS_DENIED', 'Access denied');
    }
    
  }
}