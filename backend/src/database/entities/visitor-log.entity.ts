import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { DocumentType } from './document-type.entity';

export enum VisitorPurpose {
  DOCUMENT_REQUEST = 'document_request',
  PICK_UP = 'pick_up',
}

export enum VisitorType {
  STUDENT = 'student',
  ALUMNI = 'alumni',
  NON_STUDENT = 'non_student',
}

/**
 * Lifecycle of a queue number.
 *
 *   WAITING  the number has been issued and has not yet been called
 *   SKIPPED  the number was called but the visitor was not present
 *   SERVED   the visitor was attended to at the counter
 *
 * A skipped number is not a served number: it must never carry a
 * time_out or a served_by_id, because doing so would overstate the
 * number of visitors actually attended to.
 */
export enum QueueStatus {
  WAITING = 'waiting',
  SKIPPED = 'skipped',
  SERVED = 'served',
}

@Entity('visitor_logs')
export class VisitorLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'queue_number' })
  queueNumber: string;

  @Column({ name: 'visitor_name' })
  visitorName: string;

  @Column({ name: 'contact_number', nullable: true })
  contactNumber: string;

  @Column({ name: 'student_id', nullable: true })
  studentId: string;

  @Column({
    type: 'enum',
    enum: VisitorPurpose,
    default: VisitorPurpose.DOCUMENT_REQUEST,
  })
  purpose: VisitorPurpose;

  @Column({
    name: 'visitor_type',
    type: 'enum',
    enum: VisitorType,
    default: VisitorType.NON_STUDENT,
  })
  visitorType: VisitorType;

  @Column({ name: 'document_type_id', nullable: true })
  documentTypeId: string | null;

  @Column({ name: 'tracking_number', nullable: true })
  trackingNumber: string;

  @Column({ name: 'served_by_id', nullable: true })
  servedById: string;

  @Column({ name: 'time_in' })
  timeIn: Date;

  @Column({ name: 'time_out', nullable: true })
  timeOut: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({
    name: 'queue_status',
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  queueStatus: QueueStatus;

  /** Number of times a skipped number has been returned to the queue. */
  @Column({ name: 'recall_count', type: 'smallint', default: 0 })
  recallCount: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'served_by_id' })
  servedBy: User;

  @ManyToOne(() => DocumentType, { nullable: true })
  @JoinColumn({ name: 'document_type_id' })
  documentType: DocumentType | null;
}