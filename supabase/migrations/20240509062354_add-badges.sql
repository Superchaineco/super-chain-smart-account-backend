INSERT INTO Badges (
        name,
        isActive,
        dataOrigin,
        description,
        networkOrProtocol,
        tiers,
        network,
        TierDescription
    )
VALUES (
        'Base User',
        true,
        'onChain',
        'Number of transactions made on Base',
        'Base',
        '[
            {"minValue": 100,"points": 20, "3DImage": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/3DImages/BaseUser-1.svg", "2DImage": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/2DImages/BaseUser-1.svg"},
            {"minValue": 250,"points": 50,"3DImage": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/3DImages/BaseUser-1.svg", "2DImage": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/2DImages/BaseUser-1.svg"}
        ]',
        'Base',
        '{{variable}} transactions on Base'
    );
INSERT INTO Badges (
        name,
        isActive,
        dataOrigin,
        description,
        networkOrProtocol,
        tiers,
        network,
        TierDescription
    )
VALUES (
        'OP Mainnet User',
        true,
        'onChain',
        'Number of transactions made on OP Mainnet',
        'Optimism',
        '[
            {"minValue": 100, "points": 20,"3DImage": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/3DImages/OPUser-1.svg", "2DImage":"https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/2DImages/OPUser-1.svg"},
            {"minValue": 250, "points": 50,"3DImage": "https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/3DImages/OPUser-1.svg", "2DImage":"https://ikjhtwwevrmwwjatccqi.supabase.co/storage/v1/object/public/Badges/2DImages/OPUser-1.svg"}
        ]',
        'Optimism',
        '{{variable}} transactions on OP Mainnet'
    );