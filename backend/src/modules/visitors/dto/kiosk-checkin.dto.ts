import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsUUID,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  VisitorPurpose,
  VisitorType,
} from '../../../database/entities/visitor-log.entity';

export class KioskCheckinDto {
  @IsString()
  @MaxLength(150)
  visitorName: string;

  /**
   * Supplied on document requests so the walk-in record can later be matched
   * to the requester's signed-in account (ServiceRequest.requesterEmail).
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  studentId?: string;

  @IsEnum(VisitorPurpose, {
    message: 'purpose must be either document_request or pick_up',
  })
  purpose: VisitorPurpose;

  @IsEnum(VisitorType, {
    message: 'visitorType must be student, alumni or non_student',
  })
  visitorType: VisitorType;

  @IsOptional()
  @IsUUID()
  documentTypeId?: string;

  /** Number of copies requested. Only meaningful for document requests. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  copies?: number;

  /** The visitor's stated reason for requesting the document. */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  requestPurpose?: string;

  /** Supplied on the pick-up path so staff can match the claim to a request. */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
