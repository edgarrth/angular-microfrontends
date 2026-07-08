import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export class JsonDatasetReader {
  constructor(private readonly datasetPath = process.env['DATASET_PATH'] ?? './datasets/json') {}

  read<T>(fileName: string): T[] {
    const filePath = join(this.datasetPath, fileName);
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T[];
  }
}
