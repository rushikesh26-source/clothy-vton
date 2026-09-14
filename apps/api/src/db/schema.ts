// PostgreSQL schema will go here
import { 
  pgTable, uuid, varchar, text, timestamp, 
  boolean, numeric, integer, index, unique, 
  jsonb 
} from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

// Define the pgvector custom type for Drizzle
const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config) {
    // 768 is standard for CLIP models; adjust if using SigLIP
    return `vector(${config?.dimensions || 768})`;
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`;
  },
});

export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default('staff').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("users_store_id_idx").on(table.storeId)
]);

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("customers_store_id_idx").on(table.storeId)
]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  color: varchar("color", { length: 50 }),
  material: varchar("material", { length: 100 }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  inventory: integer("inventory").default(0).notNull(),
  imageUrl: text("image_url").notNull(),
  embedding: vector("embedding"), 
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("products_store_id_idx").on(table.storeId),
  unique("products_store_sku_unique").on(table.storeId, table.sku)
]);

export const fabrics = pgTable("fabrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  material: varchar("material", { length: 100 }),
  baseColor: varchar("base_color", { length: 50 }),
  pattern: varchar("pattern", { length: 100 }),
  texture: varchar("texture", { length: 100 }),
  pricePerMeter: numeric("price_per_meter", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  imageUrl: text("image_url").notNull(),
  embedding: vector("embedding"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("fabrics_store_id_idx").on(table.storeId),
  unique("fabrics_store_sku_unique").on(table.storeId, table.sku)
]);

export const garmentDesigns = pgTable("garment_designs", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  templateUrl: text("template_url").notNull(),
  previewUrl: text("preview_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("designs_store_id_idx").on(table.storeId)
]);

export const recommendations = pgTable("recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: 'cascade' }).notNull(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: 'set null' }),
  fabricId: uuid("fabric_id").references(() => fabrics.id, { onDelete: 'set null' }),
  rank: integer("rank").notNull(),
  score: numeric("score", { precision: 5, scale: 2 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("recommendations_store_id_idx").on(table.storeId),
  index("recommendations_customer_id_idx").on(table.customerId)
]);

export const tryOnJobs = pgTable("try_on_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: 'cascade' }).notNull(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: 'set null' }),
  fabricId: uuid("fabric_id").references(() => fabrics.id, { onDelete: 'set null' }),
  garmentDesignId: uuid("garment_design_id").references(() => garmentDesigns.id, { onDelete: 'set null' }),
  personImageUrl: text("person_image_url").notNull(),
  status: varchar("status", { length: 50 }).default('queued').notNull(),
  modelName: varchar("model_name", { length: 100 }),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("jobs_store_id_idx").on(table.storeId),
  index("jobs_customer_id_idx").on(table.customerId),
  index("jobs_status_idx").on(table.status)
]);

export const tryOnResults = pgTable("try_on_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id").references(() => tryOnJobs.id, { onDelete: 'cascade' }).notNull().unique(),
  resultImageUrl: text("result_image_url").notNull(),
  processingTimeMs: integer("processing_time_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: 'cascade' }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: 'set null' }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("analytics_store_id_idx").on(table.storeId),
  index("analytics_customer_id_idx").on(table.customerId)
]);