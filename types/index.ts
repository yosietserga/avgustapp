export interface Crop {
  id: string;
  title: string;
  description: string;
  image: string;
  objectives: Objective[];
}

export interface Objective {
  id: string;
  title: string;
  image: string;
  stages: Stage[];
  segments: Segment[];
}

export interface Stage {
  id: string;
  name: string;
}

export interface Segment {
  id: string;
  name: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  start: number;
  end: number;
}