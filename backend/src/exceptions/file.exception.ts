import { BadRequestException } from '@nestjs/common';

export class FileException {
  static readonly INVALID_MIME_TYPE =
    'Invalid mime type, please upload a CSV or XLSX file.';

  static invalidMimeType() {
    return new BadRequestException(this.INVALID_MIME_TYPE);
  }
}
