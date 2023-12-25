import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Section } from './entity/section.entity';
import { CreateSectionDto } from './dtos/create.section.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  private getSectionsBaseQuery() {
    return this.sectionRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getAllSections() {
    return await this.getSectionsBaseQuery().getMany();
  }

  public async getSection(id: number): Promise<Section | undefined> {
    const query = (await this.getSectionsBaseQuery()).andWhere('e.id = :id', {
      id,
    });

    return await query.getOne();
  }

  public async createSection(input: CreateSectionDto): Promise<Section> {
    return await this.sectionRepository.save({
      ...input,
    });
  }

  public async updateSection(
    section: Section,
    input: CreateSectionDto,
  ): Promise<Section> {
    return await this.sectionRepository.save({
      ...section,
      ...input,
    });
  }

  public async deleteSection(id: number): Promise<DeleteResult> {
    return await this.sectionRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
