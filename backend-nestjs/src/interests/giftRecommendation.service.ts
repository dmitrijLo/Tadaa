import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from 'src/guests/entities/guest.entity';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import {
  GIFT_RECOMMENDATION_SYSTEM_PROMPT,
  buildGiftRecommendationUserPrompt,
} from './prompts/giftRecommendation.prompts';

export interface GiftSuggestion {
  name: string;
  description: string;
  estimatedPrice: string;
  category: string;
}

@Injectable()
export class GiftRecommendationService {
  private readonly model: ChatOpenAI;

  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateRecommendation(guestId: string): Promise<GiftSuggestion[]> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
      relations: ['interests', 'no_interests'],
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    const interests = guest.interests.map((i) => i.name).join(', ');
    const noInterests = guest.no_interests.map((i) => i.name).join(', ');
    const noteForGiver = guest.noteForGiver || '';

    const systemMessage = new SystemMessage(GIFT_RECOMMENDATION_SYSTEM_PROMPT);
    const humanMessage = new HumanMessage(buildGiftRecommendationUserPrompt(interests, noInterests, noteForGiver));

    const response = await this.model.invoke([systemMessage, humanMessage]);
    const content = response.content as string;

    const suggestions: GiftSuggestion[] = JSON.parse(content) as GiftSuggestion[];

    return suggestions;
  }
}
