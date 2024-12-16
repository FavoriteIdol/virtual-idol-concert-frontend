export interface Character {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  active: boolean;
}

export interface CharacterCreateInput {
  name: string;
  description: string;
  image: File;
  model: File;
}

export interface CharacterUpdateInput {
  name?: string;
  description?: string;
  image?: File;
  model?: File;
  active?: boolean;
} 