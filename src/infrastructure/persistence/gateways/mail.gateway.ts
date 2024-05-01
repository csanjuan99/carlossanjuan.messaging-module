import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mail, MailDocument } from '../schemas/mail.schema';
import { Model } from 'mongoose';

@Injectable()
export class MailGateway {
  constructor(
    @InjectModel(Mail.name) private readonly mailModel: Model<MailDocument>,
  ) {}

  async create(payload: Mail) {
    return this.mailModel.create(payload);
  }

  async findAll(payload: any, projection?: any, options?: any) {
    if (!options) {
      return this.mailModel.find(payload, projection);
    }
    const { page, pageSize, sort, sortBy } = options;
    return this.mailModel
      .find(payload, projection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({
        [sortBy]: sort === 'asc' ? 1 : -1,
      })
      .exec();
  }

  async findOne(payload: any, projection?: any) {
    return this.mailModel.findOne(payload, projection);
  }

  async findById(id: string, projection?: any) {
    return this.mailModel.findById(id, projection);
  }

  async updateOne(payload: any, update: any) {
    return this.mailModel.updateOne(payload, update);
  }

  async deleteOne(payload: any) {
    return this.mailModel.deleteOne(payload);
  }

  async count(payload: any) {
    return this.mailModel.countDocuments(payload);
  }

  async updateById(id: string, update: any) {
    return this.mailModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return this.mailModel.findByIdAndDelete(id);
  }
}
