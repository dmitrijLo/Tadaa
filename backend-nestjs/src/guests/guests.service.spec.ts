import { Test, TestingModule } from '@nestjs/testing';
import { GuestsService } from './guests.service';
// import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InviteStatus } from '../enums';
import { ConflictException } from '@nestjs/common';

const dto = { name: 'Max', email: 'max_power@web.de', eventId: '123' };
const mockGuestRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('GuestsService', () => {
  let service: GuestsService;
  // let repository: Repository<Guest>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestsService,
        { provide: getRepositoryToken(Guest), useValue: mockGuestRepository },
      ],
    }).compile();

    service = module.get<GuestsService>(GuestsService);
    // repository = module.get<Repository<Guest>>(getRepositoryToken(Guest));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a guest with a token and return it', async () => {
      mockGuestRepository.findOne.mockResolvedValue(null);

      const expectedGuest = {
        ...dto,
        inviteToken: 'some-uuid',
        inviteStatus: InviteStatus.INVITED,
        id: 'guest-id',
      };
      mockGuestRepository.create.mockReturnValue(expectedGuest);
      mockGuestRepository.save.mockResolvedValue(expectedGuest);

      const result = await service.create(dto);

      expect(result).toEqual(expectedGuest);
      expect(mockGuestRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          inviteToken: expect.any(String) as string,
          inviteStatus: InviteStatus.INVITED,
        }),
      );
    });

    it('should throw ConflictException if guest already exists', async () => {
      mockGuestRepository.findOne.mockResolvedValue({ id: 'existing' });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });
});
