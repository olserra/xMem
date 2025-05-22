import { XmemOrchestrator } from './xmem';
import { RedisAdapter } from './adapters/redis';

// Create orchestrator instance
export const orchestrator = new XmemOrchestrator();

// Register session provider (Redis)
// const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// orchestrator.registerProvider('session', 'redis', new RedisAdapter(redisUrl));
// orchestrator.setDefaultProvider('session', 'redis');

// TODO: Register vector and llm providers as needed 