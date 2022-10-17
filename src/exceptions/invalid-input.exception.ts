import { BadRequestException } from "@nestjs/common";

export class InvalidInputException extends BadRequestException {
  constructor(
    public code: string, 
    public message: string
  ) { super(); }
}