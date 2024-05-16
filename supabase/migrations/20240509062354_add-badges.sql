INSERT INTO Badges (
        name,
        isActive,
        dataOrigin,
        description,
        networkOrProtocol,
        image,
        tiers
    )
VALUES (
        'Base User',
        true,
        'onChain',
        'Number of transactions made on Base',
        'Base',
        'https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/BaseUser.png',
        '[{"minValue": 0, "image": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Tiers/BaseUser.png"}]'
    );
INSERT INTO Badges (
        name,
        isActive,
        dataOrigin,
        description,
        networkOrProtocol,
        image,
        tiers
    )
VALUES (
        'OP Mainnet User',
        true,
        'onChain',
        'Number of transactions made on OP Mainnet',
        'Optimism',
        'https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/OPUser.png',
        '[{"minValue": 0, "image": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Tiers/BaseUser.png"}]'
    );