import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from '$env/dynamic/private';
import { setServers } from 'node:dns';

if (!env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = env.MONGODB_URI;
// Node's system resolver can fail SRV lookups on some networks. Keep this
// configurable while using the public resolver that works in development.
setServers((env.MONGODB_DNS_SERVERS ?? '8.8.8.8').split(',').map((server) => server.trim()));
const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	const globalWithMongo = global as typeof globalThis & {
		_mongoClient?: MongoClient;
	};

	if (!globalWithMongo._mongoClient) {
		globalWithMongo._mongoClient = new MongoClient(uri, options);
	}
	client = globalWithMongo._mongoClient;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client.db(env.MONGODB_DATABASE ?? 'exam-tracker');
