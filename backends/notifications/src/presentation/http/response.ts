import { randomUUID } from 'node:crypto';
import { Response } from 'express';

export interface ApiEnvelope<T> {
  data: T;
  correlationId: string;
  generatedAt: string;
}

export function ok<T>(response: Response, data: T, status = 200): void {
  const envelope: ApiEnvelope<T> = {
    data,
    correlationId: randomUUID(),
    generatedAt: new Date().toISOString(),
  };
  response.status(status).json(envelope);
}
