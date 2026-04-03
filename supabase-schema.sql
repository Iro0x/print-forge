-- ============================================
-- PrintForge — Schema bazy danych Supabase
-- Wklej całość do: Supabase → SQL Editor → Run
-- ============================================

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  material VARCHAR(100),
  stock_qty INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE custom_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  file_path TEXT,
  file_name VARCHAR(255),
  technology VARCHAR(100),
  material VARCHAR(100),
  color VARCHAR(100),
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  quoted_price DECIMAL(10,2),
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shop_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_address TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_status VARCHAR(50),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shop_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- Indeksy
CREATE INDEX idx_custom_orders_email ON custom_orders(customer_email);
CREATE INDEX idx_custom_orders_status ON custom_orders(status);
CREATE INDEX idx_shop_orders_email ON shop_orders(customer_email);
CREATE INDEX idx_shop_orders_stripe ON shop_orders(stripe_session_id);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can create custom order" ON custom_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create shop order" ON shop_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON shop_order_items FOR INSERT WITH CHECK (true);

-- Przykładowe produkty
INSERT INTO products (name, description, price, category, material, stock_qty) VALUES
('Wazon geometryczny', 'Minimalistyczny wazon low-poly. PETG biały matowy.', 49.00, 'dekoracje', 'PETG', 15),
('Uchwyt na kontroler', 'Ergonomiczny stojak na PS5/Xbox. Montaż bez śrub.', 35.00, 'tech', 'PLA', 20),
('Organizer na biurko', 'Modułowy system na długopisy i kable.', 28.00, 'organizery', 'PLA', 30),
('Doniczka hexagonalna', 'Doniczka na sukulenty. Druk z PLA eco.', 22.00, 'dekoracje', 'PLA', 25),
('Stojak na telefon', 'Regulowany kąt, kanał na kabel.', 19.00, 'tech', 'PETG', 40),
('Wieszak na klucze', 'Minimalistyczny, montaż na ścianę.', 32.00, 'organizery', 'PLA', 18);
