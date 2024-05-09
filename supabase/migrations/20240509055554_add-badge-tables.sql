ALTER TABLE Badges
ADD COLUMN "description" TEXT,
    ADD COLUMN "image" TEXT,
    ADD COLUMN "networkOrProtocol" TEXT;
ALTER TABLE AccountBadges DROP COLUMN "title",