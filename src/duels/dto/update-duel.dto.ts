import { PartialType } from '@nestjs/mapped-types';
import { CreateDuelDto } from './create-duel.dto';

export class UpdateDuelDto extends PartialType(CreateDuelDto) {}
