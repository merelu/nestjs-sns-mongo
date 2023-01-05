export interface IBcryptService {
  hash(hashString: string): Promise<string>;
  compare(target: string, hashed: string): Promise<boolean>;
}
