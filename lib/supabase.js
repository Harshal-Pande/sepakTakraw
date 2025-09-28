import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useMock = process.env.USE_MOCK_DATA === "true";

if (!useMock && (!supabaseUrl || !supabaseAnonKey)) {
	throw new Error("Missing Supabase environment variables");
}

// Minimal mock client for local demo
function createMockClient() {
	const chain = () => ({
		select: () => chain(),
		order: () => chain(),
		eq: () => chain(),
		gte: () => chain(),
		lte: () => chain(),
		or: () => chain(),
		single: () => ({ data: null, error: null }),
		range: () => ({ data: [], error: null, count: 0 }),
	});
	return {
		from: () => chain(),
		storage: {
			from: () => ({
				upload: async () => ({ data: { path: "mock/path" }, error: null }),
				getPublicUrl: () => ({
					data: { publicUrl: "https://example.com/mock.png" },
				}),
			}),
		},
	};
}

// Client-side client for components
export const supabase = useMock
	? createMockClient()
	: createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Server-side client for API routes
export const createClient = () => {
	if (useMock) {
		return createMockClient();
	}
	const isServer = typeof window === "undefined";
	const keyToUse =
		isServer && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey;
	return createSupabaseClient(supabaseUrl, keyToUse);
};
