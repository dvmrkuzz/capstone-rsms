import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn,
    OneToMany
  } from 'typeorm';
  import { ServiceRequest } from './service-request.entity';
  
  @Entity('document_types')
  export class DocumentType {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    name: string;
  
    @Column({ nullable: true })
    description: string;
  
    @Column({ name: 'processing_days', default: 3 })
    processingDays: number;
  
    /** Regular-lane fee. Per page when pagesBased is true, otherwise per copy. */
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    fee: number;

    /**
     * True when the fee is charged per page rather than per copy, as with the
     * Transcript of Records. The page count cannot be known before the record
     * is retrieved, so an assessment for such a document is indicative only.
     */
    @Column({ name: 'pages_based', default: false })
    pagesBased: boolean;

    /** Express-lane fee, on the same basis as fee. Null when not offered. */
    @Column({ name: 'express_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
    expressFee: number | null;

    /** Documentary stamps required per issued copy. */
    @Column({ name: 'documentary_stamps', type: 'smallint', default: 0 })
    documentaryStamps: number;
  
    @Column({ name: 'requires_clearance', default: false })
    requiresClearance: boolean;
  
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToMany(() => ServiceRequest, (req) => req.documentType)
    serviceRequests: ServiceRequest[];
  }