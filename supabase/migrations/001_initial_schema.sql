-- Nadova Labs Database Schema
-- Run this in Supabase SQL Editor or via migrations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT '#00d4aa',
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GOALS TABLE (Health goals for filtering)
-- ============================================
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT '#00d4aa',
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  headline VARCHAR(300),
  description TEXT,
  dosage VARCHAR(50),
  purity VARCHAR(20) DEFAULT '99%+',
  badge VARCHAR(50),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  mechanism_of_action TEXT,
  safety_profile TEXT,
  regulatory_status TEXT,
  color VARCHAR(20) DEFAULT '#00d4aa',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT BENEFITS TABLE (One-to-many)
-- ============================================
CREATE TABLE product_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  stats VARCHAR(100),
  display_order INT DEFAULT 0
);

-- ============================================
-- PRODUCT RESEARCH REFERENCES TABLE
-- ============================================
CREATE TABLE product_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  url TEXT NOT NULL,
  source VARCHAR(100),
  display_order INT DEFAULT 0
);

-- ============================================
-- PRODUCT-GOAL JUNCTION TABLE (Many-to-many)
-- ============================================
CREATE TABLE product_goals (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  relevance_score INT DEFAULT 100, -- 0-100, how relevant this product is to the goal
  PRIMARY KEY (product_id, goal_id)
);

-- ============================================
-- CONTENT BLOCKS TABLE (CMS)
-- ============================================
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200),
  content TEXT,
  content_type VARCHAR(20) DEFAULT 'text', -- text, html, json, markdown
  page VARCHAR(50), -- which page this belongs to
  section VARCHAR(50), -- section within page
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID
);

-- ============================================
-- QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  helper_text TEXT,
  question_type VARCHAR(20) DEFAULT 'single', -- single, multiple
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- QUIZ OPTIONS TABLE
-- ============================================
CREATE TABLE quiz_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  label VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INT DEFAULT 0
);

-- ============================================
-- QUIZ OPTION WEIGHTS TABLE (Which goals/products this option points to)
-- ============================================
CREATE TABLE quiz_option_weights (
  option_id UUID REFERENCES quiz_options(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  weight INT DEFAULT 100, -- 0-100, how strongly this option indicates this goal
  PRIMARY KEY (option_id, goal_id)
);

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  subject VARCHAR(300),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- new, read, replied, archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replied_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_published ON products(is_published);
CREATE INDEX idx_product_benefits_product ON product_benefits(product_id);
CREATE INDEX idx_product_references_product ON product_references(product_id);
CREATE INDEX idx_product_goals_goal ON product_goals(goal_id);
CREATE INDEX idx_quiz_options_question ON quiz_options(question_id);
CREATE INDEX idx_content_blocks_page ON content_blocks(page);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_option_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for products, categories, goals (published only)
CREATE POLICY "Public read access for published products" ON products
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Public read access for categories" ON categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for goals" ON goals
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for product_benefits" ON product_benefits
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for product_references" ON product_references
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for product_goals" ON product_goals
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for content_blocks" ON content_blocks
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for quiz_questions" ON quiz_questions
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read access for quiz_options" ON quiz_options
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for quiz_option_weights" ON quiz_option_weights
  FOR SELECT USING (TRUE);

-- Public insert for contact submissions
CREATE POLICY "Public insert for contact_submissions" ON contact_submissions
  FOR INSERT WITH CHECK (TRUE);

-- Authenticated users can manage all tables (for admin)
CREATE POLICY "Authenticated users manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage goals" ON goals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage product_benefits" ON product_benefits
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage product_references" ON product_references
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage product_goals" ON product_goals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage content_blocks" ON content_blocks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage quiz_questions" ON quiz_questions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage quiz_options" ON quiz_options
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage quiz_option_weights" ON quiz_option_weights
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users read contact_submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users update contact_submissions" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
