import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useMock =
	process.env.USE_MOCK_DATA === "true" || !supabaseUrl || !supabaseAnonKey;

if (!useMock && (!supabaseUrl || !supabaseAnonKey)) {
	throw new Error("Missing Supabase environment variables");
}

// Enhanced mock client with sample data
function createMockClient() {
	const mockData = {
		news: [
			{
				id: "1",
				title: "National Sepaktakraw Championship 2024",
				description:
					"The annual national championship will be held in Mumbai from March 15-20, 2024. Teams from all states are invited to participate.",
				featured_image:
					"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
				created_at: "2024-01-15T10:00:00Z",
			},
			{
				id: "2",
				title: "New Training Program Launched",
				description:
					"We are excited to announce a new training program for young Sepaktakraw players. The program will focus on developing fundamental skills and techniques.",
				featured_image:
					"https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop",
				created_at: "2024-01-10T10:00:00Z",
			},
		],
		events: [
			{
				id: "1",
				title: "State Level Championship",
				description:
					"Annual state level Sepaktakraw championship for all age groups",
				event_date: "2024-03-15",
				location: "Mumbai Sports Complex",
				photos: [
					"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
				],
				created_at: "2024-01-15T10:00:00Z",
			},
			{
				id: "2",
				title: "Training Workshop",
				description: "Technical training workshop for coaches and referees",
				event_date: "2024-04-10",
				location: "Delhi Sports Academy",
				photos: [
					"https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop",
				],
				created_at: "2024-01-10T10:00:00Z",
			},
		],
		results: [
			{
				id: "1",
				title: "National Championship 2023 Results",
				description:
					"Complete results and standings from the 2023 National Sepaktakraw Championship",
				document_url: "https://example.com/results-2023.pdf",
				created_at: "2024-01-15T10:00:00Z",
			},
		],
		general_body: [
			{
				id: "1",
				district: "Mumbai",
				position: "President",
				name: "Dr. Rajesh Kumar",
				contact: "+91 98765 43210",
				email: "president@sepaktakraw.org",
				created_at: "2024-01-15T10:00:00Z",
			},
			{
				id: "2",
				district: "Delhi",
				position: "Vice President",
				name: "Ms. Priya Sharma",
				contact: "+91 98765 43211",
				email: "vicepresident@sepaktakraw.org",
				created_at: "2024-01-15T10:00:00Z",
			},
		],
		hero_images: [
			{
				id: "1",
				image_url:
					"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
				alt_text: "Sepaktakraw players in action",
				is_active: true,
				created_at: "2024-01-15T10:00:00Z",
			},
			{
				id: "2",
				image_url:
					"https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=600&fit=crop",
				alt_text: "Sepaktakraw tournament",
				is_active: true,
				created_at: "2024-01-15T10:00:00Z",
			},
		],
	};

	const chain = (tableName) => ({
		select: (columns = "*") => chain(tableName),
		order: (column, options = {}) => chain(tableName),
		eq: (column, value) => chain(tableName),
		gte: (column, value) => chain(tableName),
		lte: (column, value) => chain(tableName),
		or: (condition) => chain(tableName),
		single: () => ({
			data: mockData[tableName]?.[0] || null,
			error: null,
		}),
		range: (from, to) => ({
			data: mockData[tableName] || [],
			error: null,
			count: mockData[tableName]?.length || 0,
		}),
	});

	return {
		from: (tableName) => chain(tableName),
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
