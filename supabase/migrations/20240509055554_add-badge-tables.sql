ALTER TABLE Badges
ADD COLUMN description TEXT,
    ADD COLUMN networkOrProtocol TEXT,
    ADD COLUMN tiers JSONB NOT NULL,
    ADD COLUMN TierDescription TEXT NOT NULL,
    ADD COLUMN NETWORK TEXT NOT NULL;
CREATE OR REPLACE FUNCTION validate_tiers() RETURNS TRIGGER AS $$
DECLARE tier JSONB;
i INTEGER := 0;
BEGIN IF NEW.tiers IS NULL THEN RAISE EXCEPTION 'tiers cannot be NULL';
END IF;
FOR i IN 0..jsonb_array_length(NEW.tiers) - 1 LOOP tier := NEW.tiers->i;
IF tier->>'minValue' IS NULL THEN RAISE EXCEPTION 'minValue in tiers[%] cannot be NULL',
i;
END IF;
IF tier->>'points' IS NULL THEN RAISE EXCEPTION 'points in tiers[%] cannot be NULL',
i;
END IF;
IF tier->>'3DImage' IS NULL THEN RAISE EXCEPTION '3DImage in tiers[%] cannot be NULL',
i;
END IF;
IF tier->>'2DImage' IS NULL THEN RAISE EXCEPTION '3DImage in tiers[%] cannot be NULL',
i;
END IF;
END LOOP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER validate_tiers_trigger BEFORE
INSERT
    OR
UPDATE ON Badges FOR EACH ROW EXECUTE FUNCTION validate_tiers();