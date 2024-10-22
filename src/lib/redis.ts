import { PRIVATE_REDIS_HOST, PRIVATE_REDIS_PASSWORD, PRIVATE_REDIS_PORT } from "$env/static/private";
import Redis from "ioredis-rejson";

export const redis = new Redis({
	host: PRIVATE_REDIS_HOST,
	port: PRIVATE_REDIS_PORT,
	password: PRIVATE_REDIS_PASSWORD,
});