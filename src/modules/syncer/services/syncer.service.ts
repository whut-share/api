import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { Project, ScanTarget, User } from '@/schemas';
import { IScanTargetCreate } from '../interfaces/scan-target-create.interface';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class SyncerService {


  constructor(
    @InjectModel(ScanTarget.name)
    private scan_target_model: Model<ScanTarget>,
  ) {}


  async addScanTarget(project: Project | null, data: IScanTargetCreate) {
    const scan_target = new this.scan_target_model(data);

    scan_target._id = data.id;

    if (project) {
      scan_target.project = project.id;
    }

    await scan_target.save();
    return scan_target;
  }
}