import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import db from '$lib/server/mongodb';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	database: mongodbAdapter(db),
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID ?? '',
			clientSecret: env.GITHUB_CLIENT_SECRET ?? ''
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string
		}
	}
});
