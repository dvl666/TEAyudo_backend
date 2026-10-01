import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { StorageService } from '../storage/storage.service';
import { CreatePictogramDto } from './dtos/create-pictogram.dto';
import { Pictogram } from './entities/pictogram.entity';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { InfantService } from 'src/infant/infant.service';
import { UpdatePictogramDto } from './dtos/update-pictogram.dto';

export interface PictogramImageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class PictogramService {
  constructor(
    @InjectRepository(Pictogram)
    private readonly pictogramRepository: Repository<Pictogram>,

    private readonly storageService: StorageService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly infantService: InfantService,
  ) {}

  async create(
    dto: CreatePictogramDto,
    file: PictogramImageFile,
  ): Promise<Record<string, unknown>> {
    await this.categoryService.findOne(dto.categoryId);

    const user: any = await this.userService.findOne(dto.userId);

    const infant = await this.infantService.findOne(dto.infantId);

    const uploaded = await this.storageService.upload(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    try {
      const pictogram = this.pictogramRepository.create({
        pictogramName: dto.pictogramName,
        description: dto.description,
        personal: dto.personal,
        pictoImageUrl: uploaded.key,
        category: { id: dto.categoryId },
        user: user ?? undefined,
        infant: infant ?? undefined,
      });
      const saved = await this.pictogramRepository.save(pictogram);
      return this.withSignedImage(saved);
    } catch (error) {
      await this.storageService.delete(uploaded.key).catch(() => undefined);
      throw error;
    }
  }

  
  async findOne(id: string): Promise<Record<string, unknown>> {
    const pictogram = await this.pictogramRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!pictogram) {
      throw new NotFoundException(`Pictogram with ID ${id} not found`);
    }
    return this.withSignedImage(pictogram);
  }

  async findAllPublic(): Promise<Record<string, unknown>[]> {
    const pictograms = await this.pictogramRepository.find({
      where: { personal: false },
      relations: { category: true, infant: true },
    });
    return Promise.all(pictograms.map((item) => this.withSignedImage(item)));
  }

  async findPictogramByInfantId(infantId: string): Promise<Record<string, unknown>[]> {
    const pictograms = await this.pictogramRepository.find({
      where: { infant: { id: infantId }, personal: true },
      relations: { category: true },
    });
    return Promise.all(pictograms.map((item) => this.withSignedImage(item)));
  }

  async findPublicAndPersonalPictograms(infantId: string) {
    const privatePictograms = await this.findPictogramByInfantId(infantId);
    const publicPictograms = await this.findAllPublic();
    return [...privatePictograms, ...publicPictograms];
  }

  async findAllByTutorId(tutorId: string): Promise<Record<string, unknown>[]> {
    const pictograms = await this.pictogramRepository.find({
      where: { user: { id: tutorId } },
      relations: { category: true, infant: true },
    });
    return Promise.all(pictograms.map((item) => this.withSignedImage(item)));
  }

  async findByCategory(categoryId: string): Promise<Record<string, unknown>[]> {
    await this.categoryService.findOne(categoryId);

    const pictograms = await this.pictogramRepository.find({
      where: { category: { id: categoryId } },
      relations: { category: true },
    });

    return Promise.all(pictograms.map((item) => this.withSignedImage(item)));
  }

  async update(
    id: string,
    updatedDto: UpdatePictogramDto,
  ): Promise<Record<string, unknown>> {
    const pictogram = await this.findOne(id);

    //Preguntar esta parte
    // const { categoryId, userId, infantId, ...pictogramData } = updatedDto;
    const { categoryId, ...pictogramData } = updatedDto;

    if (categoryId !== undefined)
      pictogram.category = (await this.categoryService.findOne(categoryId))!;
    // if (userId !== undefined) pictogram.user = (await this.userService.findOne(userId))!;
    // if (infantId !== undefined) pictogram.infant = await this.infantService.findOne(infantId);

    const updatedPictogram = {
      ...pictogram,
      ...updatedDto,
    };

    const saved = await this.pictogramRepository.save(updatedPictogram);
    return this.withSignedImage(saved);
  }

  async updateImage(
    id: string,
    file: PictogramImageFile,
  ): Promise<Record<string, unknown>> {
    const pictogram = await this.pictogramRepository.findOne({ where: { id } });
    if (!pictogram) {
      throw new NotFoundException(`Pictogram with ID ${id} not found`);
    }

    const previousImageKey = pictogram.pictoImageUrl;
    const uploaded = await this.storageService.upload(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    try {
      pictogram.pictoImageUrl = uploaded.key;
      const saved = await this.pictogramRepository.save(pictogram);

      if (previousImageKey?.startsWith('pictograms/')) {
        await this.storageService
          .delete(previousImageKey)
          .catch(() => undefined);
      }

      return {
        ...saved,
        pictoImageKey: uploaded.key,
        pictoImageUrl: uploaded.url,
      };
    } catch (error) {
      await this.storageService.delete(uploaded.key).catch(() => undefined);
      throw error;
    }
  }

  private async withSignedImage(
    pictogram: Pictogram,
  ): Promise<Record<string, unknown>> {
    const key = pictogram.pictoImageUrl;
    return {
      ...pictogram,
      pictoImageKey: key,
      pictoImageUrl: await this.storageService.getSignedUrl(key),
    };
  }
}
