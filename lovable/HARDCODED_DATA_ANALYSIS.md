# Hardcoded Data Analysis & Conversion Estimates

This document analyzes all pages in the `src/pages` directory to identify hardcoded data and provides estimates for converting them to use real database data.

## Summary

**Total Pages Analyzed:** 62 pages  
**Pages with Hardcoded Data:** ~25 pages  
**Pages Using Real Data:** ~20 pages  
**Static/Informational Pages:** ~17 pages

## Current Infrastructure Status

### ⚠️ **MIGRATION REQUIRED: Moving Away from Supabase**

**Current Stack:**
- Database: Supabase (PostgreSQL via Supabase client)
- Storage: Supabase Storage
- Edge Functions: Supabase Edge Functions (28 functions)
- Auth: Supabase Auth

**Target Stack:**
- Database: **Drizzle ORM + PostgreSQL** (direct connection, backend only)
- Storage: **S3-compatible storage** (AWS S3, MinIO, DigitalOcean Spaces, etc.)
- API: **tRPC** (all database calls and business logic in backend)
- Auth: **better-auth** (replacing Supabase Auth)
- **Architecture:** All database queries and business logic moved to backend tRPC procedures

### Migration Scope

**Files Affected:**
- **97 files** using Supabase client
- **47 files** with storage operations
- **28 Supabase Edge Functions** to convert to API routes
- **Auth system** needs replacement

### Image Storage Migration ⚠️
**Status:** Currently using **Supabase Storage** - **NEEDS MIGRATION**
- Property images: `property-images` bucket
- User avatars: `avatars` bucket  
- Broker profiles: `broker-profiles` bucket
- **Migration Required:** Convert to S3-compatible storage
- **Estimate:** See Storage Migration section below

### Database Migration ⚠️
**Status:** Currently using **Supabase client** in frontend - **NEEDS MIGRATION**
- All `supabase.from()` queries currently in frontend components (97 files)
- **Architecture Change:** All database calls must move to backend tRPC procedures
- Frontend will only call tRPC procedures, no direct database access
- Real-time subscriptions need alternative solution
- **Migration Required:** 
  1. Create tRPC procedures for all database operations
  2. Move business logic from frontend to backend
  3. Update frontend to use tRPC calls instead of Supabase queries
- **Estimate:** See Database Migration section below

### Server Calls / API Pattern ⚠️
**Status:** Currently using **Supabase Edge Functions** via `supabase.functions.invoke()` - **NEEDS MIGRATION**
- **No tRPC** - not currently using tRPC
- **No REST API routes** - not using Express/Fastify API routes
- All server calls use: `supabase.functions.invoke('function-name', { body: {...} })`
- 28 Edge Functions need to be converted to tRPC procedures
- **Migration Required:** Convert to tRPC (all business logic in backend)
- **Architecture:** Frontend → tRPC procedures → Drizzle ORM → PostgreSQL
- **Estimate:** See tRPC Migration section below

### Email & Notifications ⚠️
**Status:** Partially implemented - **NEEDS COMPLETION**

**Email Service:**
- Currently using **Resend** (via Supabase Edge Function)
- Only 1 email type implemented: Property inquiry emails (`send-property-inquiry`)
- Email templates are hardcoded HTML in Edge Function
- Comments indicate emails should be sent for:
  - Ad approval confirmations (not implemented)
  - Payment confirmations (not implemented)
  - Ad publication confirmations (not implemented)
- **Migration Required:** Move to backend tRPC procedure, keep Resend or choose alternative

**Notifications:**
- `NotificationCenter` component exists but uses **mock/hardcoded data**
- Comment in code: "In a real implementation, you'd have a notifications table"
- No notifications table in database
- No notification sending service implemented
- `user_preferences` table has `email_notifications` field but not actively used
- **Migration Required:** Implement proper notification system

### Search Implementation ⚠️
**Status:** Currently using PostgreSQL `ILIKE` queries and PostGIS for geographic search
- Basic text search: `ILIKE '%search%'` on address fields
- Geographic search: PostGIS `ST_Distance` and `ST_DWithin` functions
- No dedicated search index (Meilisearch, Elasticsearch, Algolia)
- **Performance concern:** As property count grows, `ILIKE` queries will become slow
- **Recommendation:** Implement Meilisearch or similar for better search performance
- **Note:** Can be done after database migration

---

## Email & Notification System Implementation

### Current State
- **Email:** Resend service used in 1 Edge Function only
- **Notifications:** Mock data, no real implementation
- **Missing:** Email confirmations for payments, ad approvals, etc.
- **Missing:** Notification system with database table

### Email System Migration & Completion

**Estimate: 8-12 hours**

**Breakdown:**
1. **Email Service Setup (1-2 hours)**
   - Keep Resend or evaluate alternatives (SendGrid, Postmark, AWS SES)
   - Set up email service in backend
   - Configure email templates (move from hardcoded HTML)
   - Set up email queue/job system (optional, for reliability)

2. **Create Email Templates (2-3 hours)**
   - Property inquiry email (already exists, move to template)
   - Ad approval confirmation email
   - Payment confirmation email
   - Ad publication confirmation email
   - Password reset email (if not in better-auth)
   - Welcome email
   - Other transactional emails

3. **Create tRPC Procedures for Emails (3-4 hours)**
   - Convert `send-property-inquiry` Edge Function to tRPC procedure
   - Create procedures for all email types
   - Integrate with Resend API
   - Handle errors and retries
   - Add email logging/tracking

4. **Update Frontend (1-2 hours)**
   - Replace `supabase.functions.invoke('send-property-inquiry')` with tRPC call
   - Add email sending calls where needed (ad approvals, payments, etc.)
   - Update error handling

5. **Testing (1-2 hours)**
   - Test all email types
   - Test email delivery
   - Test error handling
   - Verify email templates render correctly

### Notification System Implementation

**Estimate: 12-18 hours**

**Breakdown:**
1. **Database Schema (2-3 hours)**
   - Create `notifications` table
   - Create indexes for performance
   - Set up Drizzle schema
   - Create migrations

2. **Backend tRPC Procedures (4-6 hours)**
   - Create notification procedures:
     - `createNotification` - Create a notification
     - `getNotifications` - Get user notifications
     - `markAsRead` - Mark notification as read
     - `markAllAsRead` - Mark all as read
     - `deleteNotification` - Delete notification
     - `getUnreadCount` - Get unread count
   - Add notification triggers (when properties match saved searches, price changes, etc.)
   - Integrate with email system (send email if user has email_notifications enabled)

3. **Notification Service/Queue (2-3 hours)**
   - Create background job system for notifications
   - Handle notification delivery (in-app + email)
   - Respect user preferences (email_notifications, push_notifications)
   - Implement notification batching/digests

4. **Update Frontend (2-3 hours)**
   - Replace mock data in `NotificationCenter` with real tRPC calls
   - Set up real-time updates (WebSocket or polling)
   - Update notification badge counts
   - Handle notification clicks/navigation

5. **Notification Types Implementation (2-3 hours)**
   - Property match notifications (when new property matches saved search)
   - Price change notifications (when watched property price changes)
   - New message notifications
   - Viewing scheduled notifications
   - Market update notifications
   - System notifications

---

## Infrastructure Migration Estimates

### 1. Database Migration: Supabase → Drizzle ORM + PostgreSQL (Backend Only)

**Scope:**
- 97 files using Supabase client in frontend
- All `supabase.from()` queries currently in frontend components
- All `supabase.rpc()` calls (stored procedures)
- Real-time subscriptions (if any)
- Database schema migration
- **Architecture Change:** Move ALL database access to backend tRPC procedures

**Estimate: 60-90 hours** (increased due to architecture change)

**Breakdown:**
1. **Backend Setup & Drizzle ORM (6-8 hours)**
   - Set up backend server (Express/Fastify/Hono with tRPC)
   - Install Drizzle ORM and PostgreSQL driver
   - Set up database connection pool in backend
   - Create Drizzle schema definitions from existing Supabase schema
   - Set up migrations system
   - Configure environment variables
   - Set up tRPC router structure

2. **Schema Definition (8-12 hours)**
   - Convert Supabase schema to Drizzle schema
   - Define all tables, relationships, indexes
   - Handle PostGIS types for geographic data
   - Set up migrations for schema changes
   - Test schema matches existing database

3. **Create tRPC Procedures for Database Operations (30-45 hours)**
   - **Identify all database operations** in 97 frontend files
   - **Group operations by domain** (properties, users, rentals, brokers, etc.)
   - **Create tRPC procedures** for each operation:
     - Property CRUD operations
     - User/profile operations
     - Rental operations
     - Broker operations
     - Search and filtering operations
     - Analytics and statistics operations
     - Messaging operations
     - Favorites/saved properties
     - etc.
   - Convert all `supabase.from()` queries to Drizzle queries in backend
   - Convert filters, joins, aggregations
   - Handle complex queries (PostGIS, full-text search)
   - Define Zod schemas for input/output validation
   - Add authentication/authorization middleware
   - Test each procedure

4. **Move Business Logic to Backend (10-15 hours)**
   - Identify business logic currently in frontend components
   - Move validation logic to backend
   - Move calculation logic to backend
   - Move data transformation logic to backend
   - Ensure all data processing happens server-side

5. **Update Frontend to Use tRPC (12-18 hours)**
   - Replace all `supabase.from()` calls with tRPC procedure calls
   - Replace all `supabase.rpc()` calls with tRPC procedure calls
   - Update 97 files systematically
   - Set up tRPC client hooks
   - Update error handling
   - Update loading states
   - Test each conversion

6. **Stored Procedures & Functions (4-6 hours)**
   - Convert `supabase.rpc()` calls to tRPC procedures
   - Either keep as PostgreSQL functions or convert to application logic in backend
   - Update all call sites in frontend

7. **Real-time Subscriptions (2-4 hours)**
   - Replace Supabase real-time with alternative (WebSockets, Server-Sent Events, polling)
   - Implement via tRPC subscriptions or separate WebSocket server
   - Update components using real-time features
   - Test real-time functionality

8. **Testing & Bug Fixes (4-6 hours)**
   - Integration testing
   - End-to-end testing
   - Performance testing
   - Fix migration issues
   - Verify all database operations work correctly

---

### 2. Storage Migration: Supabase Storage → S3-Compatible Storage

**Scope:**
- 47 files with storage operations
- 3 buckets: `property-images`, `avatars`, `broker-profiles`
- Upload operations
- Public URL generation
- Storage policies/access control

**Estimate: 12-18 hours**

**Breakdown:**
1. **S3 Setup (2-3 hours)**
   - Choose S3-compatible provider (AWS S3, MinIO, DigitalOcean Spaces, etc.)
   - Set up buckets
   - Configure CORS
   - Set up access keys and policies
   - Configure CDN (CloudFront, etc.) if needed

2. **Storage Client Setup (2-3 hours)**
   - Install S3 SDK (@aws-sdk/client-s3 or similar)
   - Create storage utility/service
   - Implement upload, delete, getPublicUrl functions
   - Handle errors and retries

3. **Code Migration (6-8 hours)**
   - Replace `supabase.storage.from().upload()` with S3 upload
   - Replace `supabase.storage.from().getPublicUrl()` with S3 URL generation
   - Replace `supabase.storage.from().remove()` with S3 delete
   - Update 47 files
   - Handle file paths and naming conventions

4. **Data Migration (1-2 hours)**
   - Migrate existing images from Supabase Storage to S3
   - Update database records with new URLs
   - Verify all images are accessible

5. **Testing (1-2 hours)**
   - Test uploads for all file types
   - Test public URL access
   - Test deletion
   - Test error handling

---

### 3. Edge Functions Migration: Supabase Functions → tRPC Procedures

**Current Pattern:**
- All server calls use: `supabase.functions.invoke('function-name', { body: {...} })`
- **No tRPC** currently in use
- 28 Supabase Edge Functions need conversion to tRPC procedures
- **Architecture:** All business logic will be in backend tRPC procedures

**Estimate: 35-50 hours**

**Breakdown:**
1. **tRPC Setup (4-6 hours)**
   - Install tRPC and dependencies (@trpc/server, @trpc/client, @trpc/react-query)
   - Set up tRPC router structure
   - Configure procedures and routers
   - Set up client-side tRPC hooks
   - Configure authentication middleware
   - Set up error handling and formatting
   - Configure CORS and security

2. **Function Migration (25-35 hours)**
   - Convert each Edge Function to tRPC procedure
   - Define input/output schemas using Zod
   - Update Supabase client calls to Drizzle ORM (in backend)
   - Update storage calls to S3 (in backend)
   - Move all business logic to backend procedures
   - Handle authentication/authorization in procedures
   - Test each procedure
   - Average 1.5-2 hours per function (28 functions)

3. **Client-Side Updates (4-6 hours)**
   - Replace all `supabase.functions.invoke()` calls with tRPC client calls
   - Update 31+ files using functions
   - Set up React Query integration for tRPC
   - Update error handling
   - Update loading states
   - Benefit: Full type safety on client

4. **Testing & Deployment (2-4 hours)**
   - Integration testing
   - Type checking
   - End-to-end testing
   - Deploy backend to production
   - Monitor and fix issues

**Key Functions to Migrate:**
- AI functions (8): ai-category-search, ai-natural-search, ai-property-valuation, ai-market-analysis, ai-property-advisor, ai-property-recommendations, ai-homestyling, ai-image-editor, ai-image-generator, ai-document-generator, ai-support-chat
- Payment functions (3): create-ad-payment, verify-ad-payment, create-subscription-checkout, check-subscription, customer-portal
- Verification functions (3): verify-bankid, verify-rental-content, verify-marketing-content
- Utility functions (14): send-property-inquiry, publish-social-media, generate-dac7-report, delete-user-account, analyze-property-description, batch-analyze-properties, osm-boundary, mapbox-token, google-maps-key

---

### 4. Authentication Migration: Supabase Auth → better-auth

**Scope:**
- Supabase Auth currently used
- Replacing with **better-auth** library

**Estimate: 14-20 hours**

**Breakdown:**
1. **better-auth Setup (2-3 hours)**
   - Install better-auth package
   - Set up better-auth server configuration
   - Configure database adapter (Drizzle ORM)
   - Set up environment variables
   - Configure session management

2. **Database Schema Setup (2-3 hours)**
   - Create better-auth required tables (users, sessions, accounts, etc.)
   - Set up Drizzle schema for auth tables
   - Run migrations
   - Ensure compatibility with existing user data structure

3. **Provider Configuration (3-4 hours)**
   - Configure email/password provider
   - Configure BankID provider (if better-auth supports it, or custom integration)
   - Set up OAuth providers if needed
   - Configure email verification
   - Set up password reset flows

4. **Code Migration (5-7 hours)**
   - Replace `supabase.auth` calls with better-auth client
   - Update `useAuth` hook to use better-auth
   - Update all auth-dependent components (97+ files)
   - Replace `supabase.auth.getUser()` with better-auth session
   - Replace `supabase.auth.signIn()` with better-auth signIn
   - Replace `supabase.auth.signUp()` with better-auth signUp
   - Replace `supabase.auth.signOut()` with better-auth signOut
   - Update protected routes to use better-auth middleware
   - Handle session management

5. **User Migration (1-2 hours)**
   - Migrate existing users from Supabase Auth to better-auth format
   - Migrate passwords (hash format compatibility check)
   - Update user metadata if needed
   - Test user login with migrated accounts

6. **Testing (1-2 hours)**
   - Test all auth flows (sign up, sign in, sign out)
   - Test email verification
   - Test password reset
   - Test protected routes
   - Test session persistence
   - Test BankID integration (if applicable)

**better-auth Benefits:**
- Type-safe with TypeScript
- Works well with Drizzle ORM
- Modern API design
- Good documentation
- Flexible provider system

---

## Pages with Hardcoded Statistics & Numbers

### 1. **Kommersiellt.tsx** (Commercial Properties)
**Hardcoded Data:**
- Statistics cards: `8,450` kommersiella objekt, `1,2M m²` tillgänglig yta, `340` aktiva mäklare, `94%` klientnöjdhet
- Property type counts: `3,240` kontor, `2,180` butiker, `1,890` lager, `1,140` investeringsobjekt
- All informational content (legal, economic, location analysis cards) - static content

**Conversion Estimate:** 4-6 hours
- Create database queries to count properties by type
- Calculate total area from property records
- Count active brokers from `brokers` table
- Calculate client satisfaction from reviews/ratings (if available)
- Keep informational cards as static content (educational material)

---

### 2. **Nyproduktion.tsx** (New Construction)
**Hardcoded Data:**
- Statistics: `847` aktiva projekt, `23,500` kommande lägenheter, `156` byggare & utvecklare, `89%` slutsålda inom 1 år
- Featured projects section: 3 hardcoded projects ("Nya Kajen", "Villastad Syd", "Centrum Park") with images, prices, locations, descriptions
- All informational content cards (purchase process, BRF info, financing, warranties, etc.) - static

**Conversion Estimate:** 6-8 hours
- Query `properties` table filtered by `nyproduktion_project_id` to count active projects
- Count total units from `nyproduktion_total_units` field
- Count unique developers from `developer` or `user_id` fields
- Calculate sold percentage from status field
- Replace featured projects with query for top 3 projects by views/favorites or featured flag
- Keep informational cards as static content

---

### 3. **FritidTomter.tsx** (Leisure Properties)
**Hardcoded Data:**
- Badge: `Över 15,000 objekt` (line 56)
- Recommended properties section (lines 84-85) - commented out but structure exists
- All informational content cards - static

**Conversion Estimate:** 2-3 hours
- Query count of properties with `property_type` in ['COTTAGE', 'PLOT']
- Implement recommended properties query (already has structure in code)
- Keep informational cards as static content

---

### 4. **Kop.tsx** (Buy Properties)
**Hardcoded Data:**
- Badge: `Över 125,000 annonser` (line 29)
- Search filters are UI only (not connected to real search)

**Conversion Estimate:** 1-2 hours
- Query total count of properties with status 'FOR_SALE'
- Connect search filters to actual PropertySearch component functionality

---

### 5. **Rentals.tsx** (Rental Properties)
**Status:** ✅ Uses real data via `RentalProperties` component
**Note:** Count is dynamic via `onCountChange` callback

---

### 6. **TillSalu.tsx** (For Sale)
**Status:** ✅ Uses real data via `PropertySearch` component

---

### 7. **Search.tsx**
**Status:** ✅ Uses real data via `PropertySearch` component

---

## Pages with Hardcoded Featured/Example Listings

### 8. **Nyproduktion.tsx** - Featured Projects Section
**Hardcoded Data:**
- 3 featured projects with complete data:
  - "Nya Kajen" - Hammarby Sjöstad, Stockholm, 4.2M kr, 127 lägenheter
  - "Villastad Syd" - Nacka, Stockholm, 8.9M kr, 45 villor
  - "Centrum Park" - Centrum, Göteborg, 3.1M kr, 89 lägenheter

**Conversion Estimate:** 3-4 hours
- Query top 3 projects by:
  - Featured flag (if exists)
  - Views/favorites count
  - Recently added
  - Or create admin panel to mark featured projects
- Map database fields to display format

---

### 9. **FlowingAds.tsx** (Component, used in Index.tsx)
**Hardcoded Data:**
- Array of 10+ example properties with complete data (prices, locations, images, features)
- Used on homepage to showcase properties

**Conversion Estimate:** 4-5 hours
- Query featured properties from database
- Filter by `ad_tier` = 'premium' or featured flag
- Order by priority score or views
- Limit to top 10-12 properties

---

### 10. **PropertyListings.tsx** (Component)
**Hardcoded Data:**
- Creates 9 test properties in `fetchProperties()` function
- Complete property data including images, prices, locations, broker info

**Conversion Estimate:** 3-4 hours
- Replace test data with Supabase query
- Filter by user's saved properties or all properties
- Implement pagination

---

### 11. **PropertySearch.tsx** (Component)
**Hardcoded Data:**
- Creates 9 test properties in `loadProperties()` function
- Same structure as PropertyListings

**Conversion Estimate:** 3-4 hours
- Replace with real Supabase queries
- Apply filters from search parameters
- Implement proper pagination and sorting

---

## Pages with Hardcoded Test Data Files

### 12. **testProperties.ts** (Data file)
**Hardcoded Data:**
- 9 complete property objects with all fields
- Used by multiple components

**Conversion Estimate:** Already replaced when components are updated
- Remove file once components use real data

---

### 13. **testFritidsProperties.ts** (Data file)
**Hardcoded Data:**
- Multiple leisure property objects

**Conversion Estimate:** Remove when FritidsProperties component uses real data

---

### 14. **testNyproduktionProperties.ts** (Data file)
**Hardcoded Data:**
- Multiple new construction property objects

**Conversion Estimate:** Remove when NyproduktionProperties component uses real data

---

## Pages Using Real Data (No Changes Needed)

✅ **Index.tsx** - Uses components that fetch data  
✅ **Rentals.tsx** - Uses RentalProperties component  
✅ **TillSalu.tsx** - Uses PropertySearch component  
✅ **Search.tsx** - Uses PropertySearch component  
✅ **NyproduktionDetail.tsx** - Fetches from Supabase  
✅ **PropertyDetails.tsx** - Likely fetches from database  
✅ **RentalDetails.tsx** - Likely fetches from database  
✅ **BrokerPropertyDetails.tsx** - Fetches from Supabase  
✅ **MarketShareStats.tsx** - Calculates from real data  
✅ **PropertyManagement.tsx** - Uses real data  
✅ **RentalAdManagement.tsx** - Uses real data  
✅ **SalesAdManagement.tsx** - Uses real data  
✅ **AdManagement.tsx** - Uses real data  
✅ **EditAd.tsx** - Uses real data  
✅ **EditRentalAd.tsx** - Uses real data  
✅ **CreateRental.tsx** - Creates real data  
✅ **PropertyAd.tsx** - Creates real data  
✅ **Dashboard.tsx** - Uses real data  
✅ **Profile.tsx** - Uses real data  
✅ **Messages.tsx** - Uses real data  

---

## Static/Informational Pages (No Database Needed)

These pages contain static content and don't need database conversion:

- **OmOss.tsx** - About page with company info
- **FragorSvar.tsx** - FAQ with hardcoded Q&A (could be moved to CMS later)
- **Terms.tsx** - Terms and conditions
- **Privacy.tsx** - Privacy policy
- **Cookies.tsx** - Cookie policy
- **GdprInfo.tsx** - GDPR information
- **Support.tsx** - Support information
- **BankIdInfo.tsx** - BankID information
- **DigitalaHyreskontrakt.tsx** - Information page
- **Kostnadskalkylator.tsx** - Calculator tool (no data storage)
- **Prisanalys.tsx** - Analysis tool
- **Tools.tsx** - Tools listing
- **AITools.tsx** - AI tools information
- **AIHomestyling.tsx** - Tool page
- **AIImageEditor.tsx** - Tool page
- **AISokassistent.tsx** - Tool page
- **Upgrade.tsx** - Pricing/subscription page
- **PaymentSuccess.tsx** - Success page
- **NotFound.tsx** - 404 page
- **Auth.tsx** - Auth page
- **BrokerLogin.tsx** - Login page
- **PrivateLogin.tsx** - Login page
- **BrokerPortal.tsx** - Portal (uses real data)
- **BrokerProfile.tsx** - Profile (uses real data)
- **OfficeProfile.tsx** - Profile (uses real data)
- **KommersiellFastighet.tsx** - Detail page (likely uses real data)
- **SnartTillSalu.tsx** - Listing page (likely uses real data)
- **Map.tsx** - Map view (uses real data)
- **EnhancedSearch.tsx** - Search (uses real data)
- **SearchResults.tsx** - Results (uses real data)
- **Salj.tsx** - Uses test data for examples (see below)

---

## Special Cases

### 15. **Salj.tsx** (Sell Page)
**Hardcoded Data:**
- Uses `TEST_LISTING_PROPERTIES[0]` to create example properties showing different ad tiers
- This is intentional for demonstration purposes

**Conversion Estimate:** 1 hour (optional)
- Could fetch a real property to use as example
- Or keep test data for consistent demo experience

---

### 16. **FragorSvar.tsx** (FAQ)
**Hardcoded Data:**
- Large array of FAQ categories and questions/answers (lines 16-328)
- All content is hardcoded

**Conversion Estimate:** 4-6 hours (optional, low priority)
- Move FAQ content to database table
- Create admin interface to manage FAQs
- Keep current structure but load from database
- Or move to CMS system

---

## Database Schema Requirements

To support these conversions, ensure these fields/tables exist:

1. **Properties Table:**
   - `nyproduktion_project_id` - for grouping new construction units
   - `nyproduktion_total_units` - total units in project
   - `developer` - developer name
   - `is_featured` - boolean flag for featured properties
   - `featured_priority` - number for ordering featured items
   - `property_type` - for filtering (COTTAGE, PLOT, etc.)

2. **Statistics/Aggregations:**
   - Consider creating materialized views or cached statistics for:
     - Total property counts by type
     - Total area calculations
     - Active broker counts
     - Sold percentages

3. **Featured Content:**
   - Add `is_featured` flag to properties table
   - Or create separate `featured_properties` table with priority ordering

4. **Search Index Schema (Meilisearch):**
   - Index structure should include:
     - `id` (primary key)
     - `title` (searchable, ranked)
     - `description` (searchable, ranked lower)
     - `address_street`, `address_city`, `address_postal_code` (searchable)
     - `property_type` (filterable)
     - `status` (filterable)
     - `price` (filterable, sortable)
     - `living_area`, `rooms`, `bedrooms` (filterable, sortable)
     - `features` (searchable array)
     - `latitude`, `longitude` (for geographic search)
     - `created_at` (sortable)
     - `ad_tier` (filterable, for sorting premium first)

5. **Drizzle ORM Schema Requirements (Backend Only):**
   - Define all tables with proper types
   - Set up relationships (foreign keys)
   - Define indexes for performance
   - Handle PostGIS types for geographic data
   - Set up migrations system
   - Consider using Drizzle Kit for migrations
   - **Important:** All database access through backend only, no direct frontend access

6. **tRPC Router Structure:**
   - Organize by domain:
     - `properties` router (CRUD, search, filters)
     - `rentals` router (CRUD, search, filters)
     - `users` router (profiles, preferences)
     - `brokers` router (broker operations, analytics)
     - `ai` router (AI functions)
     - `payments` router (subscriptions, payments)
     - `messaging` router (messages, notifications)
     - `analytics` router (statistics, reports)
   - Each router contains related procedures
   - All procedures use Drizzle ORM for database access
   - All procedures include authentication/authorization

7. **S3 Storage Structure:**
   - Bucket organization:
     - `property-images/{user_id}/{property_id}/{filename}`
     - `avatars/{user_id}/{filename}`
     - `broker-profiles/{user_id}/{filename}`
   - Public vs private buckets
   - CDN configuration
   - CORS settings
   - Lifecycle policies for cleanup

8. **Email Service Requirements:**
   - Choose email provider (Resend recommended, or SendGrid/Postmark/AWS SES)
   - Set up email templates (React Email, MJML, or HTML)
   - Configure sending domain
   - Set up email queue for reliability (optional: BullMQ, Inngest, etc.)
   - Email logging and tracking
   - Handle bounces and unsubscribes

9. **Notification System Requirements:**
   - `notifications` table with fields:
     - `id`, `user_id`, `type`, `title`, `message`, `is_read`, `priority`
     - `related_id`, `metadata`, `created_at`
   - Notification preferences in `user_preferences` table
   - Background job system for notification delivery
   - Real-time updates (WebSocket or polling)
   - Email integration (send email if user enabled email_notifications)

---

## Priority Recommendations

### Phase 1: Infrastructure Migration (MUST DO FIRST)
1. **Database Migration** - Supabase → Drizzle ORM in Backend (60-90 hours) 🔴 **CRITICAL**
   - Move ALL database calls from frontend to backend tRPC procedures
   - Move ALL business logic to backend
2. **Storage Migration** - Supabase Storage → S3 (12-18 hours) 🔴 **CRITICAL**
3. **Edge Functions Migration** - Supabase Functions → tRPC Procedures (35-50 hours) 🔴 **CRITICAL**
   - All business logic in backend tRPC procedures
4. **Authentication Migration** - Supabase Auth → better-auth (14-20 hours) 🔴 **CRITICAL**
5. **Email System** - Complete email implementation (8-12 hours) 🟡 **IMPORTANT**
   - Move Resend to backend, complete missing email types
6. **Notification System** - Implement notification system (12-18 hours) 🟡 **IMPORTANT**
   - Create notifications table, implement notification service

### Phase 2: Data Conversion (After Migration)
7. **PropertySearch.tsx** - Replace test data (3-4 hours)
8. **PropertyListings.tsx** - Replace test data (3-4 hours)
9. **FlowingAds.tsx** - Use real featured properties (4-5 hours)
10. **Kommersiellt.tsx** - Real statistics (4-6 hours)
11. **Nyproduktion.tsx** - Real statistics + featured projects (6-8 hours)

### Phase 3: Search & Optimization
12. **Meilisearch Implementation** - Search index setup (12-16 hours) ⚠️ **Critical for scale**
13. **Search Integration** - Update all search components to use Meilisearch (4-5 hours)

### Phase 4: Polish & Enhancements
14. **Kop.tsx** - Real property count (1-2 hours)
15. **FritidTomter.tsx** - Real count + recommended (2-3 hours)
16. **Nyproduktion.tsx** - Featured projects section (3-4 hours)
17. **FragorSvar.tsx** - Move to CMS/database (4-6 hours) (Low Priority)
18. **Salj.tsx** - Use real example property (1 hour) (Low Priority)

---

## Search Index Implementation (Meilisearch)

### Current Search Limitations
- Using PostgreSQL `ILIKE` queries which become slow with large datasets
- No full-text search capabilities
- No fuzzy matching or typo tolerance
- Limited relevance ranking
- Geographic search works but could be optimized

### Meilisearch Implementation Estimate: **12-16 hours**

**Tasks:**
1. **Setup & Configuration (2-3 hours)**
   - Install Meilisearch (Docker or cloud service)
   - Configure indexes for properties
   - Set up environment variables

2. **Data Indexing (3-4 hours)**
   - Create Supabase Edge Function or background job to sync properties to Meilisearch
   - Handle real-time updates (inserts, updates, deletes)
   - Index property fields: title, description, address, features, etc.

3. **Search Integration (4-5 hours)**
   - Replace `ILIKE` queries with Meilisearch API calls
   - Update `PropertySearch.tsx` component
   - Update `RentalProperties.tsx` component
   - Update `CommercialProperties.tsx` component
   - Update `NyproduktionProperties.tsx` component
   - Update `FritidsProperties.tsx` component
   - Update AI search functions (`ai-natural-search`, `ai-category-search`)

4. **Advanced Features (2-3 hours)**
   - Configure searchable attributes and ranking rules
   - Add filters for property type, price, area, etc.
   - Implement faceted search
   - Add typo tolerance and fuzzy matching
   - Geographic search integration (may need separate PostGIS queries)

5. **Testing & Optimization (1-2 hours)**
   - Test search performance
   - Optimize index settings
   - Handle edge cases and errors

**Alternative:** If Meilisearch is not preferred, consider:
- **PostgreSQL Full-Text Search:** 6-8 hours (less features, but simpler)
- **Algolia:** 10-14 hours (more expensive, but managed service)
- **Elasticsearch:** 16-20 hours (more complex, but very powerful)

---

## Total Estimated Time

### Infrastructure Migration (Required First)
- **Database Migration (Supabase → Drizzle ORM in Backend):** 60-90 hours
  - Includes moving all database calls from frontend to backend tRPC procedures
- **Storage Migration (Supabase Storage → S3):** 12-18 hours
- **Edge Functions Migration (Supabase Functions → tRPC Procedures):** 35-50 hours
  - All business logic moved to backend
- **Authentication Migration (Supabase Auth → better-auth):** 14-20 hours
- **Email System Migration & Completion:** 8-12 hours
  - Move Resend integration to backend, complete missing email types
- **Notification System Implementation:** 12-18 hours
  - Create notifications table, implement notification service
- **Infrastructure Subtotal:** 141-208 hours

### Data Conversion (After Migration)
- **High Priority:** 20-27 hours  
- **Medium Priority:** 6-9 hours  
- **Low Priority:** 5-7 hours  
- **Data Conversion Subtotal:** 31-43 hours

### Search Index Implementation
- **Meilisearch Setup:** 12-16 hours

### Grand Total: 184-265 hours

**Note:** Infrastructure migration should be done first, as it affects all other work. Data conversion can be done in parallel with some migration tasks, but search index should be done after database migration is complete.

---

## Implementation Notes

1. **Statistics Caching:** Consider implementing a caching layer for statistics that don't change frequently (e.g., total counts). Update cache when properties are added/removed.

2. **Featured Properties:** Create an admin interface to mark properties as featured, or use algorithm based on views/favorites.

3. **Test Data Cleanup:** Once components are converted, remove test data files to avoid confusion.

4. **Error Handling:** Ensure all new queries have proper error handling and loading states.

5. **Performance:** For pages with multiple statistics, consider:
   - Parallel queries using `Promise.all()`
   - Database indexes on frequently queried fields
   - Pagination for large result sets

6. **Image Storage Migration:** When migrating to S3:
   - Choose S3-compatible provider (consider cost, performance, location)
   - Set up CDN (CloudFront, etc.) for image delivery
   - Implement image optimization before upload (resize, compress)
   - Set up proper cleanup when properties are deleted
   - Migrate existing images with URL updates in database
   - Consider image processing pipeline (thumbnails, formats)

7. **Database Migration Strategy:**
   - **Architecture:** All database access moves to backend tRPC procedures
   - **Phase 1:** Set up backend server with tRPC and Drizzle ORM
   - **Phase 2:** Create tRPC procedures for read operations first
   - **Phase 3:** Create tRPC procedures for write operations
   - **Phase 4:** Move business logic from frontend to backend procedures
   - **Phase 5:** Update frontend to call tRPC procedures instead of Supabase
   - Keep Supabase running in parallel during migration
   - Use feature flags to switch between old/new implementations
   - Migrate in phases: low-risk components first, then critical paths
   - Test each procedure thoroughly before switching frontend calls

8. **tRPC Migration Strategy:**
   - **All business logic in backend:** No database calls in frontend
   - Group operations by domain (properties, users, rentals, brokers, AI, payments, etc.)
   - Create tRPC routers for each domain
   - Migrate one domain at a time
   - Keep old Supabase functions running during migration
   - Use feature flags to switch between old/new implementations
   - Test thoroughly before switching traffic
   - **Benefits:** Type safety end-to-end, better DX, automatic type inference, centralized business logic

9. **Search Index Sync:** When implementing Meilisearch (after migration):
   - Set up real-time sync using database triggers or change streams
   - Handle bulk re-indexing for existing properties
   - Monitor sync lag and errors
   - Consider using background jobs for sync logic
   - Use Drizzle ORM for database queries in sync process

---

## Testing Checklist

After conversion, test:
- [ ] Statistics display correctly
- [ ] Featured properties load properly
- [ ] Search/filter functionality works
- [ ] Pagination works correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Performance is acceptable (<2s load time)
- [ ] Mobile responsiveness maintained
- [ ] Image uploads work correctly
- [ ] Image URLs are accessible
- [ ] Search index syncs correctly (if Meilisearch implemented)
- [ ] Search results are relevant and fast
- [ ] Geographic search works correctly
- [ ] Filters work with search index

---

---

## Migration Checklist

### Pre-Migration
- [ ] Choose S3-compatible storage provider
- [ ] Choose email service (Resend recommended, or alternative)
- [ ] Set up backend server infrastructure (hosting for tRPC server)
- [ ] Set up new PostgreSQL connection (if separate from Supabase)
- [ ] Create backup of Supabase database
- [ ] Document all Supabase features in use
- [ ] Review better-auth documentation and requirements
- [ ] Document all `supabase.functions.invoke()` calls (31+ files)
- [ ] Document all `supabase.from()` database calls (97 files)
- [ ] Identify all business logic currently in frontend components
- [ ] Plan tRPC router structure (by domain)
- [ ] Identify all email sending needs (currently and planned)
- [ ] Plan notification system architecture

### Database Migration (Backend Only)
- [ ] Set up backend server (Express/Fastify/Hono)
- [ ] Install Drizzle ORM and PostgreSQL driver
- [ ] Create Drizzle schema definitions
- [ ] Set up database connection in backend
- [ ] Test schema matches existing database
- [ ] Install and configure tRPC
- [ ] Set up tRPC router structure
- [ ] Identify all database operations in frontend (97 files)
- [ ] Create tRPC procedures for read operations
- [ ] Create tRPC procedures for write operations
- [ ] Move business logic from frontend to backend procedures
- [ ] Test all procedures in backend
- [ ] Update frontend to use tRPC calls (replace all `supabase.from()`)
- [ ] Test all database operations end-to-end
- [ ] Deploy backend to production

### Storage Migration
- [ ] Set up S3 buckets
- [ ] Configure access policies
- [ ] Set up CDN
- [ ] Create storage utility/service
- [ ] Migrate code to use S3
- [ ] Migrate existing images
- [ ] Update database URLs
- [ ] Test all storage operations

### Edge Functions Migration (to tRPC)
- [ ] Set up tRPC router (if not already done in database migration)
- [ ] Set up tRPC client hooks in frontend
- [ ] Convert each Edge Function to tRPC procedure (28 functions)
- [ ] Define Zod schemas for all inputs/outputs
- [ ] Move all business logic to backend procedures
- [ ] Update Supabase client calls to Drizzle ORM (in backend)
- [ ] Update storage calls to S3 (in backend)
- [ ] Replace all `supabase.functions.invoke()` calls with tRPC calls (31+ files)
- [ ] Update error handling in frontend
- [ ] Test all procedures
- [ ] Deploy backend
- [ ] Switch traffic from old to new

### Authentication Migration
- [ ] Install better-auth package
- [ ] Set up better-auth server configuration
- [ ] Configure Drizzle adapter for better-auth
- [ ] Create auth database tables (users, sessions, accounts)
- [ ] Configure email/password provider
- [ ] Configure BankID provider (or custom integration)
- [ ] Set up email verification and password reset
- [ ] Replace all `supabase.auth` calls with better-auth
- [ ] Update `useAuth` hook
- [ ] Update protected routes
- [ ] Migrate existing users and passwords
- [ ] Test all auth flows (sign up, sign in, sign out, reset)
- [ ] Test session management
- [ ] Deploy auth system

### Email System Migration
- [ ] Set up Resend (or chosen email service) in backend
- [ ] Create email template system
- [ ] Convert `send-property-inquiry` to tRPC procedure
- [ ] Create tRPC procedures for all email types
- [ ] Implement ad approval confirmation emails
- [ ] Implement payment confirmation emails
- [ ] Implement ad publication confirmation emails
- [ ] Test all email types
- [ ] Update frontend to use tRPC email calls

### Notification System Implementation
- [ ] Create `notifications` table in database
- [ ] Set up Drizzle schema for notifications
- [ ] Create tRPC procedures for notifications
- [ ] Implement notification service/queue
- [ ] Replace mock data in NotificationCenter with real data
- [ ] Implement real-time notification updates
- [ ] Implement property match notifications
- [ ] Implement price change notifications
- [ ] Implement message notifications
- [ ] Integrate notifications with email system
- [ ] Test notification system end-to-end

### Post-Migration
- [ ] Remove Supabase dependencies
- [ ] Clean up old code
- [ ] Update documentation
- [ ] Monitor for issues
- [ ] Optimize performance

---

*Last Updated: Analysis completed for all 62 pages + infrastructure migration requirements*

