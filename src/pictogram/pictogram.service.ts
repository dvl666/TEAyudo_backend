import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { ModerationService } from '../storage/moderation.service';
import { CreatePictogramDto } from './dtos/create-pictogram.dto';
import { Pictogram } from './entities/pictogram.entity';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { InfantService } from 'src/infant/infant.service';
import { UpdatePictogramDto } from './dtos/update-pictogram.dto';
import { WhatItIsRound } from 'src/game/interfaces/what-it-is/round.interface';
import { PictogramImageSigned } from './interfaces/pictogram-image-sign.interface';

export interface PictogramImageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface PictogramRound {
  round: number;
  prompt: string;
  correctPictogramId: string;
  pictograms: PictogramImageSigned[];
}

@Injectable()
export class PictogramService {
  constructor(
    @InjectRepository(Pictogram)
    private readonly pictogramRepository: Repository<Pictogram>,

    private readonly storageService: StorageService,
    private readonly moderationService: ModerationService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly infantService: InfantService,
  ) {}

  async create( dto: CreatePictogramDto, file: PictogramImageFile ): Promise<PictogramImageSigned> {
    await this.categoryService.findOne(dto.categoryId);

    const user: any = await this.userService.findOne(dto.userId);

    if (dto.infantId) await Promise.all(dto.infantId.map((id) => this.infantService.findOne(id)));

    // 1. Validar la imagen con AWS Rekognition antes de subir a S3
    await this.moderationService.validateImageBuffer(file.buffer);

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
        infantId: dto.infantId,
      });

      const saved = await this.pictogramRepository.save(pictogram);
      return this.withSignedImage(saved);
    } catch (error) {
      await this.storageService.delete(uploaded.key).catch(() => undefined);
      throw error;
    }
  }

  async findOne(id: string): Promise<PictogramImageSigned> {
    const pictogram = await this.pictogramRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!pictogram) throw new NotFoundException(`Pictogram with ID ${id} not found`);
    
    return this.withSignedImage(pictogram);
  }

  async findAllPublic(): Promise<PictogramImageSigned[]> {
    const pictograms = await this.pictogramRepository.find({
      where: { personal: false },
      relations: { category: true },
    });

    return Promise.all(pictograms.map((item) => this.withSignedImage(item)));
  }

  async findPictogramByInfantId( infantId: string ): Promise<PictogramImageSigned[]> {
    const pictograms = await this.pictogramRepository.find({
      where: { infantId: ArrayContains([infantId]), personal: true },
      relations: { category: true },
    });

    return Promise.all(pictograms.map(( item ) => this.withSignedImage(item)));
  }

  async findPublicAndPersonalPictograms( infantId: string ) {
    const privatePictograms = await this.findPictogramByInfantId(infantId);
    const publicPictograms = await this.findAllPublic();

    return [...privatePictograms, ...publicPictograms];
  }

  async findAllByTutorId( tutorId: string ): Promise<PictogramImageSigned[]> {
    const pictograms = await this.pictogramRepository.find({
      where: { user: { id: tutorId } },
      relations: { category: true },
    });

    return Promise.all(pictograms.map((item) => this.withSignedImage(item)));
  }

  async findByCategory(categoryId: string): Promise<PictogramImageSigned[]> {
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
  ): Promise<PictogramImageSigned> {
    const pictogram = await this.pictogramRepository.findOne({ where: { id } });
    if (!pictogram)
      throw new NotFoundException(`Pictogram with ID ${id} not found`);
    const { categoryId, ...pictogramData } = updatedDto;
    if (categoryId !== undefined)
      pictogram.category = (await this.categoryService.findOne(categoryId))!;
    if (pictogramData.infantId !== undefined) {
      await Promise.all(
        pictogramData.infantId.map((infantId) =>
          this.infantService.findOne(infantId),
        ),
      );
    }
    const updatedPictogram = { ...pictogram, ...pictogramData };
    const saved = await this.pictogramRepository.save(updatedPictogram);
    return this.withSignedImage(saved);
  }

  async find20ByCategory(
    categoryId: string,
  ): Promise<WhatItIsRound[]> {
    await this.categoryService.findOne(categoryId);

    const pictograms = await this.pictogramRepository.find({
      where: {
        category: { id: categoryId },
        personal: false,
      },
      relations: { category: true },
      order: { id: 'ASC' },
      take: 20,
    });

    if (pictograms.length < 20) return this.find5ByCategory(categoryId);

    const signedPictograms = await Promise.all(
      pictograms.map((pictogram) => this.withSignedImage(pictogram)),
    );

    return Array.from({ length: 5 }, (_, index) => {
      const start = index * 4;
      const correctPictogram = pictograms[start + Math.floor(Math.random() * 4)];

      return {
        round: index + 1,
        prompt: correctPictogram.pictogramName,
        correctPictogramId: correctPictogram.id,
        pictograms: signedPictograms.slice(start, start + 4),
      };
    });
  }

  async find5ByCategory(categoryId: string): Promise<WhatItIsRound[]> {
    await this.categoryService.findOne(categoryId);

    const pictograms = await this.pictogramRepository.find({
      where: { category: { id: categoryId }, personal: false },
      relations: { category: true },
      order: { id: 'ASC' },
      take: 5,
    });

    if (pictograms.length < 5) {
      throw new BadRequestException(
        'La categoría debe tener al menos 5 pictogramas públicos para crear 5 rondas.',
      );
    }

    const signedPictograms = await Promise.all(
      pictograms.map((pictogram) => this.withSignedImage(pictogram)),
    );

    return signedPictograms.map((pictogram, index) => ({
      round: index + 1,
      prompt: pictogram.pictogramName,
      correctPictogramId: pictogram.id,
      pictograms: signedPictograms.filter(
        (_, optionIndex) => optionIndex !== (index + 1) % signedPictograms.length,
      ),
    }));
  }

  ///////////////////////////////
  //STORAGE SERVICE FOR IMAGES//
  /////////////////////////////
  
  async updateImage(
    id: string,
    file: PictogramImageFile,
  ): Promise<PictogramImageSigned> {
    const pictogram = await this.pictogramRepository.findOne({ where: { id } });
    if (!pictogram) {
      throw new NotFoundException(`Pictogram with ID ${id} not found`);
    }

    // Validar la imagen con AWS Rekognition antes de subir a S3
    await this.moderationService.validateImageBuffer(file.buffer);

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
  ): Promise<PictogramImageSigned> {
    const key = pictogram.pictoImageUrl;
    return {
      ...pictogram,
      pictoImageKey: key,
      pictoImageUrl: await this.storageService.getSignedUrl(key),
    };
  }
}
