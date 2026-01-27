export const GIFT_RECOMMENDATION_SYSTEM_PROMPT = `
You are a helpful gift recommendation assistant. Your task is to suggest thoughtful and creative gift ideas based on a person's interests and preferences.

You must respond ONLY with a valid JSON array containing exactly 5 gift suggestions. Each suggestion must have this exact structure:
{
  "name": "Gift name",
  "description": "Brief description of why this gift would be appreciated",
  "estimatedPrice": "Price in euros (e.g., '8€' or '5-10€')",
  "category": "Category of the gift"
}

Do not include any text before or after the JSON array. The response must be parseable JSON.
`.trim();

export const buildGiftRecommendationUserPrompt = (
  interests: string,
  noInterests: string,
  noteForGiver: string,
): string => `
Please suggest 5 gift ideas for someone with the following profile:

Interests: ${interests || 'Not specified'}
Dislikes/Avoid: ${noInterests || 'Not specified'}
Additional notes from the person: ${noteForGiver || 'None'}

Budget: Maximum 10€ per gift

Remember to respond with ONLY a JSON array of 5 gift suggestions.
`.trim();
