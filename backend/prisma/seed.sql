-- Seed data for Affection Messages

-- SWEET messages
INSERT INTO "AffectionMessage" (category, text) VALUES
('SWEET', 'Cutie!'),
('SWEET', 'Babe!'),
('SWEET', 'Sweetie!'),
('SWEET', 'Winner!'),
('SWEET', 'Amazing!'),
('SWEET', 'You rock!'),
('SWEET', 'Hero!')
ON CONFLICT DO NOTHING;

-- AFFECTIONATE messages
INSERT INTO "AffectionMessage" (category, text) VALUES
('AFFECTIONATE', 'I Love You!'),
('AFFECTIONATE', 'Stay Mine Forever'),
('AFFECTIONATE', 'Love You to the Moon!'),
('AFFECTIONATE', 'You''re My Everything'),
('AFFECTIONATE', 'My Heart Beats for You'),
('AFFECTIONATE', 'Forever Yours')
ON CONFLICT DO NOTHING;

-- FLIRTY messages
INSERT INTO "AffectionMessage" (category, text) VALUES
('FLIRTY', 'Looking Hot!'),
('FLIRTY', 'Making Me Blush'),
('FLIRTY', 'Simply Irresistible'),
('FLIRTY', 'Caught Me! ;)'),
('FLIRTY', 'You''re Trouble ;-)'),
('FLIRTY', 'Ooh la la!')
ON CONFLICT DO NOTHING;

-- Seed Game Config
INSERT INTO "GameConfig" (key, value, description) VALUES
('heartSpeed', '2', 'Base falling speed for hearts'),
('spawnRate', '1000', 'Base spawn interval in milliseconds'),
('bucketSpeed', '10', 'Bucket movement speed'),
('difficultyTiers', 
 '[{"score": 0, "speed": 2, "rate": 1000}, {"score": 50, "speed": 3, "rate": 800}, {"score": 150, "speed": 5, "rate": 600}]',
 'Difficulty progression settings')
ON CONFLICT (key) DO NOTHING;
