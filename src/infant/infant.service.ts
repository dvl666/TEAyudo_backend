import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Infant } from './entities/infant.entity';
import { Repository } from 'typeorm';
import { CreateInfantDto } from './dtos/create-infant.dto';
import { UserService } from 'src/user/user.service';
import { StorageService } from 'src/storage/storage.service';
import { UpdateInfantDto } from './dtos/update-infant.dto';

export interface InfantAvatarFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class InfantService {
  constructor(
    @InjectRepository(Infant)
    private readonly infantRepository: Repository<Infant>,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  async create(createInfantDto: CreateInfantDto): Promise<Infant> {
    const user = await this.userService.findOne(createInfantDto.userId);
    const { userId, ...infantData } = createInfantDto;
    const infant = this.infantRepository.create(infantData);
    infant.users = [user!];
    return this.infantRepository.save(infant);
  }

  findAll(): Promise<Infant[]> {
    return this.infantRepository.find();
  }

  async findOne(id: string): Promise<Infant> {
    const infant = await this.infantRepository.findOne({ where: { id } });
    if (!infant) throw new NotFoundException(`Infant with id ${id} not found`);
    return infant;
  }

  async update(id: string, updateInfantDto: UpdateInfantDto): Promise<Infant> {
    const infant = await this.findOne(id);
    const updatedInfant = {
      ...infant,
      ...updateInfantDto,
    }
    return this.infantRepository.save(updatedInfant);
  }

  async uploadAvatar(id: string, file: InfantAvatarFile): Promise<Record<string, unknown>> {
    const infant = await this.findOne(id);
    const previousAvatarKey = infant.avatarUrl;
    const uploaded = await this.storageService.uploadAvatar(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    try {
      infant.avatarUrl = uploaded.key;
      const saved = await this.infantRepository.save(infant);

      if (previousAvatarKey?.startsWith('avatars/')) {
        await this.storageService
          .delete(previousAvatarKey)
          .catch(() => undefined);
      }

      return {
        ...saved,
        avatarKey: uploaded.key,
        avatarUrl: uploaded.url,
      };
    } catch (error) {
      await this.storageService.delete(uploaded.key).catch(() => undefined);
      throw error;
    }
  }
}
