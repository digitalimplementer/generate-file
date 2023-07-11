import { BadRequestException } from '@nestjs/common';
import { errorResponses } from './responses';

export function validateDate(fromDate, toDate) {
  const regex = /^\d{4}([./-])\d{2}\1\d{2}$/;

  if (!regex.test(fromDate.trim()) || !regex.test(toDate.trim())) {
    throw new BadRequestException(errorResponses.dateNotValid);
  }

  const dateFrom = new Date(fromDate);
  const dateTo = new Date(toDate);

  if (dateFrom > new Date() || dateFrom > dateTo) {
    throw new BadRequestException(errorResponses.dateFromNotValid);
  }

  if (dateTo < dateFrom || dateTo > new Date()) {
    throw new BadRequestException(errorResponses.dateToNotValid);
  }
}
