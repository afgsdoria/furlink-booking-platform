/*
  # Initial Database Schema for furlink Platform

  1. New Tables
    - `profiles` - Extended user profile information
      - `id` (uuid, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `mobile_number` (text)
      - `role` (enum: pet_owner, service_provider, admin)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_sessions` - Track user login sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `ip_address` (text)
      - `user_agent` (text)
      - `login_time` (timestamp)
      - `logout_time` (timestamp, nullable)
    
    - `service_providers` - Business information for service providers
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `business_name` (text)
      - `description` (text)
      - `address` (text)
      - `google_maps_link` (text)
      - `qr_code_url` (text)
      - `status` (enum: pending, approved, declined)
      - `admin_notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `provider_images` - Facility images for service providers
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references service_providers)
      - `image_url` (text)
      - `image_type` (enum: facility, permit, waiver)
      - `created_at` (timestamp)
    
    - `provider_staff` - Staff information for service providers
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references service_providers)
      - `full_name` (text)
      - `years_experience` (integer)
      - `skills` (text[])
      - `created_at` (timestamp)
    
    - `provider_services` - Services and pricing offered by providers
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references service_providers)
      - `service_name` (text)
      - `service_type` (text)
      - `base_price` (decimal)
      - `description` (text)
      - `duration_minutes` (integer)
      - `created_at` (timestamp)
    
    - `provider_addons` - Add-on services and extra charges
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references service_providers)
      - `addon_name` (text)
      - `price` (decimal)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `provider_hours` - Operating hours for service providers
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references service_providers)
      - `day_of_week` (integer) -- 0=Sunday, 1=Monday, etc.
      - `open_time` (time)
      - `close_time` (time)
      - `is_closed` (boolean default false)
    
    - `pets` - Pet information for bookings
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `size` (enum: small, medium, large, extra_large)
      - `weight` (decimal)
      - `date_of_birth` (date)
      - `breed` (text)
      - `behavior_notes` (text)
      - `medications` (text, nullable)
      - `allergies` (text, nullable)
      - `emergency_consent` (boolean default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings` - Service bookings
      - `id` (uuid, primary key)
      - `pet_owner_id` (uuid, references profiles)
      - `service_provider_id` (uuid, references service_providers)
      - `pet_id` (uuid, references pets)
      - `service_id` (uuid, references provider_services)
      - `booking_date` (date)
      - `booking_time` (time)
      - `status` (enum: pending, approved, declined, paid, completed, cancelled)
      - `decline_reason` (text, nullable)
      - `special_instructions` (text, nullable)
      - `total_amount` (decimal)
      - `convenience_fee` (decimal default 0.00)
      - `payment_proof_url` (text, nullable)
      - `payment_verified` (boolean default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `booking_addons` - Add-ons selected for bookings
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `addon_id` (uuid, references provider_addons)
      - `quantity` (integer default 1)
    
    - `feedback` - Customer feedback for completed services
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `pet_owner_id` (uuid, references profiles)
      - `service_provider_id` (uuid, references service_providers)
      - `pet_care_rating` (integer) -- 1-5 stars
      - `service_quality_rating` (integer) -- 1-5 stars
      - `cleanliness_rating` (integer) -- 1-5 stars
      - `punctuality_rating` (integer) -- 1-5 stars
      - `value_rating` (integer) -- 1-5 stars
      - `comments` (text, nullable)
      - `created_at` (timestamp)
    
    - `notifications` - System notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `title` (text)
      - `message` (text)
      - `read` (boolean default false)
      - `related_booking_id` (uuid, references bookings, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add admin policies for service provider approval workflow
    - Ensure proper data isolation between users

  3. Enums and Custom Types
    - Create custom enum types for consistent data validation
    - Add proper constraints and indexes for performance
*/

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('pet_owner', 'service_provider', 'admin');
CREATE TYPE provider_status AS ENUM ('pending', 'approved', 'declined');
CREATE TYPE image_type AS ENUM ('facility', 'permit', 'waiver');
CREATE TYPE pet_size AS ENUM ('small', 'medium', 'large', 'extra_large');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'declined', 'paid', 'completed', 'cancelled');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  mobile_number text NOT NULL,
  role user_role NOT NULL DEFAULT 'pet_owner',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sessions for tracking logins
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  user_agent text,
  login_time timestamptz DEFAULT now(),
  logout_time timestamptz
);

-- Service providers business information
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  google_maps_link text,
  qr_code_url text,
  status provider_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Provider facility images, permits, waivers
CREATE TABLE IF NOT EXISTS provider_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_type image_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Provider staff information
CREATE TABLE IF NOT EXISTS provider_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  years_experience integer NOT NULL CHECK (years_experience >= 0),
  skills text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Services offered by providers
CREATE TABLE IF NOT EXISTS provider_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  service_type text NOT NULL,
  base_price decimal(10,2) NOT NULL CHECK (base_price >= 0),
  description text,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  created_at timestamptz DEFAULT now()
);

-- Add-ons and extra charges
CREATE TABLE IF NOT EXISTS provider_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  addon_name text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Operating hours
CREATE TABLE IF NOT EXISTS provider_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time time,
  close_time time,
  is_closed boolean DEFAULT false,
  UNIQUE(provider_id, day_of_week)
);

-- Pet information
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  size pet_size NOT NULL,
  weight decimal(5,2) NOT NULL CHECK (weight > 0),
  date_of_birth date NOT NULL,
  breed text NOT NULL,
  behavior_notes text NOT NULL,
  medications text,
  allergies text,
  emergency_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES provider_services(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  decline_reason text,
  special_instructions text,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  convenience_fee decimal(10,2) DEFAULT 0.00 CHECK (convenience_fee >= 0),
  payment_proof_url text,
  payment_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Booking add-ons junction table
CREATE TABLE IF NOT EXISTS booking_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  addon_id uuid NOT NULL REFERENCES provider_addons(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  UNIQUE(booking_id, addon_id)
);

-- Customer feedback
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  pet_owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_provider_id uuid NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  pet_care_rating integer NOT NULL CHECK (pet_care_rating >= 1 AND pet_care_rating <= 5),
  service_quality_rating integer NOT NULL CHECK (service_quality_rating >= 1 AND service_quality_rating <= 5),
  cleanliness_rating integer NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  punctuality_rating integer NOT NULL CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  value_rating integer NOT NULL CHECK (value_rating >= 1 AND value_rating <= 5),
  comments text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

-- System notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  related_booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_service_providers_status ON service_providers(status);
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pet_owner_id ON bookings(pet_owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_provider_id ON bookings(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can read own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for service_providers
CREATE POLICY "Users can read own provider profile"
  ON service_providers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own provider profile"
  ON service_providers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own provider profile"
  ON service_providers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can read approved providers"
  ON service_providers
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

-- RLS Policies for provider_images
CREATE POLICY "Provider can manage own images"
  ON provider_images
  FOR ALL
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read approved provider images"
  ON provider_images
  FOR SELECT
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE status = 'approved'
    )
  );

-- RLS Policies for provider_staff
CREATE POLICY "Provider can manage own staff"
  ON provider_staff
  FOR ALL
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read approved provider staff"
  ON provider_staff
  FOR SELECT
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE status = 'approved'
    )
  );

-- RLS Policies for provider_services
CREATE POLICY "Provider can manage own services"
  ON provider_services
  FOR ALL
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read approved provider services"
  ON provider_services
  FOR SELECT
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE status = 'approved'
    )
  );

-- RLS Policies for provider_addons
CREATE POLICY "Provider can manage own addons"
  ON provider_addons
  FOR ALL
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read approved provider addons"
  ON provider_addons
  FOR SELECT
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE status = 'approved'
    )
  );

-- RLS Policies for provider_hours
CREATE POLICY "Provider can manage own hours"
  ON provider_hours
  FOR ALL
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read approved provider hours"
  ON provider_hours
  FOR SELECT
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM service_providers WHERE status = 'approved'
    )
  );

-- RLS Policies for pets
CREATE POLICY "Pet owners can manage own pets"
  ON pets
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- RLS Policies for bookings
CREATE POLICY "Pet owners can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (pet_owner_id = auth.uid());

CREATE POLICY "Service providers can read their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    service_provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pet owners can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (pet_owner_id = auth.uid());

CREATE POLICY "Pet owners can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (pet_owner_id = auth.uid());

CREATE POLICY "Service providers can update their bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    service_provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for booking_addons
CREATE POLICY "Booking participants can read addons"
  ON booking_addons
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE pet_owner_id = auth.uid() 
      OR service_provider_id IN (
        SELECT id FROM service_providers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Pet owners can manage booking addons"
  ON booking_addons
  FOR ALL
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE pet_owner_id = auth.uid()
    )
  );

-- RLS Policies for feedback
CREATE POLICY "Pet owners can manage own feedback"
  ON feedback
  FOR ALL
  TO authenticated
  USING (pet_owner_id = auth.uid());

CREATE POLICY "Service providers can read their feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (
    service_provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can manage own notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, date_of_birth, mobile_number, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE((new.raw_user_meta_data->>'date_of_birth')::date, CURRENT_DATE),
    COALESCE(new.raw_user_meta_data->>'mobile_number', ''),
    'pet_owner'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON service_providers
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();