import { SessionStore } from '../xmem';
import Redis from 'ioredis';

export class RedisAdapter implements SessionStore {
  private client: Redis;

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl);
  }

  async getSession(sessionId: string): Promise<Record<string, unknown> | null> {
    const data = await this.client.get(sessionId);
    return data ? JSON.parse(data) : null;
  }

  async setSession(sessionId: string, data: Record<string, unknown>): Promise<void> {
    await this.client.set(sessionId, JSON.stringify(data));
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.client.del(sessionId);
  }
} 