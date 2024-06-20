import { IsMongoId } from 'class-validator';

export class IdDto {
  @IsMongoId()
  term: string;
}

