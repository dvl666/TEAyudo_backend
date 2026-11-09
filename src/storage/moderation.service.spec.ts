import { BadRequestException } from '@nestjs/common';
import { ModerationService } from './moderation.service';

describe('ModerationService name validation', () => {
  let service: ModerationService;

  beforeEach(() => {
    service = new ModerationService();
  });

  it.each(['puto', 'P.U.T.O', 'PÚTO'])(
    'rejects prohibited words despite case, accents, or punctuation: %s',
    (name) => {
      expect(() => service.validatePictogramName(name)).toThrow(
        BadRequestException,
      );
    },
  );

  it('allows names without prohibited words', () => {
    expect(() => service.validatePictogramName('comer manzana')).not.toThrow();
  });
});
