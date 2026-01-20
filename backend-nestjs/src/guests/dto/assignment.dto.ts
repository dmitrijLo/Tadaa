// guests/dto/assignment.dto.ts
export class AssignmentDto {
  event: {
    name: string;
    budget: number;
    currency: string;
    eventDate: Date;
  };
  receiver: {
    name: string;
    noteForGiver: string | null;
    interests: string[];
    noInterests: string[];
  };
}
