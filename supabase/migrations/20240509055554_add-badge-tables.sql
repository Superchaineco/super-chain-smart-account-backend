ALTER TABLE Badges
ADD COLUMN description TEXT,
ADD COLUMN image TEXT,
ADD COLUMN networkOrProtocol TEXT,
ADD COLUMN tiers JSONB NOT NULL; 

CREATE OR REPLACE FUNCTION validate_tiers()
RETURNS TRIGGER AS $$
DECLARE
    tier JSONB;
    i INTEGER := 0;
BEGIN
    IF NEW.tiers IS NULL THEN
        RAISE EXCEPTION 'tiers cannot be NULL';
    END IF;

    FOR i IN 0 .. jsonb_array_length(NEW.tiers) - 1 LOOP
        tier := NEW.tiers->i;
        IF tier->>'minValue' IS NULL THEN
            RAISE EXCEPTION 'minValue in tiers[%] cannot be NULL', i;
        END IF;
        IF tier->>'image' IS NULL THEN
            RAISE EXCEPTION 'image in tiers[%] cannot be NULL', i;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_tiers_trigger
BEFORE INSERT OR UPDATE ON Badges
FOR EACH ROW
EXECUTE FUNCTION validate_tiers();
