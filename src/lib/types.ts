export interface Headline {
  title: string;
  source: string;
}

export interface SourceDef {
  id: string;
  name: string;
  prefix: string;
  url: string;
  defaultEnabled: boolean;
  fetch(count: number): Promise<Headline[]>;
}
