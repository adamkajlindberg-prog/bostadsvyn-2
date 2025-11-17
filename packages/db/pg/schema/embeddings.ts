import {
	index,
	integer,
	pgTable,
	serial,
	text,
	vector,
} from "drizzle-orm/pg-core";
import { resources } from "./resources";
import { EMBEDDING_DIMENSIONALITY } from "../../env";

export const embeddings = pgTable(
	"embedding",
	{
		content: text("content").notNull(),
		embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONALITY }).notNull(),
		id: serial("id").primaryKey(),
		resourceId: integer("resource_id").references(() => resources.id, {
			onDelete: "cascade",
		}),
	},
	(table) => ({
		embeddingIndex: index("embeddingIndex").using(
			"hnsw",
			table.embedding.op("vector_cosine_ops"),
		),
	}),
);
