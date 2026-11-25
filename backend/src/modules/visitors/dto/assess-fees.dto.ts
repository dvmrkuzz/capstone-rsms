import { IsUUID, IsOptional, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/** Asks what a document request would cost, without creating the request. */
export class AssessFeesDto {
  @IsUUID()
  documentTypeId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  copies?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pages?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isExpress?: boolean;
}
