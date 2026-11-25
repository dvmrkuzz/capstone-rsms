import { DocumentType } from '../../database/entities/document-type.entity';

/**
 * Price of one documentary stamp, per Request Form FM-BUC-REG-056 (Rev. 03,
 * effective 2 May 2024). This is a single institutional rate rather than a
 * per-document value, so it is held here as one constant. A change to the
 * rate is a one-line change; see the recommendation in Chapter 7 on moving
 * institutional rates into a configurable settings table.
 */
export const DOCUMENTARY_STAMP_FEE = 30.0;

export interface FeeLine {
  label: string;
  detail: string;
  amount: number;
}

export interface Assessment {
  lines: FeeLine[];
  total: number;
  /** True when the total cannot be final at request time. */
  indicative: boolean;
  note: string | null;
}

/**
 * Works out what a requester will need to pay at the cashier.
 *
 * This is an assessment of fees, not a receipt: the system does not accept
 * payment, and the Official Receipt is issued by the cashier of the
 * Registrar's Office.
 *
 * A document charged per page cannot be assessed finally at the kiosk,
 * because the page count is only certain once the record has been retrieved.
 * Such an assessment is returned with indicative set to true.
 */
export function assessFees(
  documentType: Pick<
    DocumentType,
    'name' | 'fee' | 'pagesBased' | 'expressFee' | 'documentaryStamps'
  >,
  copies: number,
  pages: number | null,
  isExpress: boolean,
): Assessment {
  // Express pricing applies only where the Registrar offers an express rate
  // for the document. Where it does not, the regular rate stands and the
  // assessment must say so rather than describe the charge as express.
  const expressApplies =
    isExpress &&
    documentType.expressFee !== null &&
    documentType.expressFee !== undefined;

  const unitFee = expressApplies
    ? Number(documentType.expressFee)
    : Number(documentType.fee);

  const lines: FeeLine[] = [];
  const lane = expressApplies ? 'express lane' : 'regular';

  if (documentType.pagesBased) {
    const pageCount = pages && pages > 0 ? pages : null;
    const units = pageCount ? pageCount * copies : 0;
    lines.push({
      label: documentType.name,
      detail: pageCount
        ? `${pageCount} page${pageCount === 1 ? '' : 's'} x ${copies} cop${copies === 1 ? 'y' : 'ies'} x PHP ${unitFee.toFixed(2)} per page (${lane})`
        : `PHP ${unitFee.toFixed(2)} per page (${lane}) - page count to be determined`,
      amount: units * unitFee,
    });
  } else {
    lines.push({
      label: documentType.name,
      detail: `${copies} cop${copies === 1 ? 'y' : 'ies'} x PHP ${unitFee.toFixed(2)} (${lane})`,
      amount: copies * unitFee,
    });
  }

  const stampCount = (documentType.documentaryStamps ?? 0) * copies;
  if (stampCount > 0) {
    lines.push({
      label: 'Documentary stamp',
      detail: `${stampCount} pc x PHP ${DOCUMENTARY_STAMP_FEE.toFixed(2)}`,
      amount: stampCount * DOCUMENTARY_STAMP_FEE,
    });
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  const indicative = documentType.pagesBased && !(pages && pages > 0);

  return {
    lines,
    total: Math.round(total * 100) / 100,
    indicative,
    note: indicative
      ? 'The Transcript of Records is charged per page. The amount above excludes the page fee, which the Registrar’s Office will determine once the record has been retrieved.'
      : null,
  };
}
