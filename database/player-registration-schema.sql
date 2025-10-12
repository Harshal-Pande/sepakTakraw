-- Player Registration Database Schema
-- This replaces Google Forms implementation with database-backed solution

-- Step 1: Reference Number Generation Table
CREATE TABLE IF NOT EXISTS player_reference_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE NULL
);

-- Step 2: Complete Registration Data Table
CREATE TABLE IF NOT EXISTS player_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) NOT NULL REFERENCES player_reference_numbers(reference_number),
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    
    -- Address Information
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    
    -- Sports Information
    playing_position VARCHAR(50),
    experience_years INTEGER DEFAULT 0,
    previous_teams TEXT,
    achievements TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    
    -- Documents (file URLs)
    photo_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    medical_certificate_url VARCHAR(500),
    
    -- Registration Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    reviewed_by UUID NULL,
    review_notes TEXT NULL,
    
    -- Additional Fields
    additional_notes TEXT,
    terms_accepted BOOLEAN DEFAULT FALSE,
    privacy_policy_accepted BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_player_reference_numbers_email ON player_reference_numbers(email);
CREATE INDEX IF NOT EXISTS idx_player_reference_numbers_ref_num ON player_reference_numbers(reference_number);
CREATE INDEX IF NOT EXISTS idx_player_reference_numbers_expires_at ON player_reference_numbers(expires_at);

CREATE INDEX IF NOT EXISTS idx_player_registrations_ref_num ON player_registrations(reference_number);
CREATE INDEX IF NOT EXISTS idx_player_registrations_email ON player_registrations(email);
CREATE INDEX IF NOT EXISTS idx_player_registrations_status ON player_registrations(status);
CREATE INDEX IF NOT EXISTS idx_player_registrations_submitted_at ON player_registrations(submitted_at);

-- Function to generate reference number
CREATE OR REPLACE FUNCTION generate_player_reference_number()
RETURNS TEXT AS $$
DECLARE
    ref_num TEXT;
    year_part TEXT;
    sequence_part TEXT;
    counter INTEGER;
BEGIN
    -- Get current year
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(reference_number FROM 'SPF-' || year_part || '-(.*)') AS INTEGER)), 0) + 1
    INTO counter
    FROM player_reference_numbers
    WHERE reference_number LIKE 'SPF-' || year_part || '-%';
    
    -- Format sequence part with leading zeros
    sequence_part := LPAD(counter::TEXT, 5, '0');
    
    -- Generate reference number
    ref_num := 'SPF-' || year_part || '-' || sequence_part;
    
    RETURN ref_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate reference number
CREATE OR REPLACE FUNCTION set_reference_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
        NEW.reference_number := generate_player_reference_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_reference_number
    BEFORE INSERT ON player_reference_numbers
    FOR EACH ROW
    EXECUTE FUNCTION set_reference_number();

-- Sample data for testing (optional)
-- INSERT INTO player_reference_numbers (full_name, email) VALUES 
-- ('John Doe', 'john.doe@example.com'),
-- ('Jane Smith', 'jane.smith@example.com');
