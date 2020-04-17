BEGIN;

TRUNCATE
    tallyit_player_scores,
    tallyit_games,
    tallyit_groups
    RESTART IDENTITY CASCADE;

INSERT INTO tallyit_groups (group_name)
VALUES
    ('Demo'),
    ('bestfam123'),
    ('ssbros');

INSERT INTO tallyit_games (game_name, date_created, group_id)
VALUES
    ('Jenga',
     '2020-04-10 19:00:00',
     1),
    ('Euchre',
     '2020-04-12 19:00:00',
     1),
    ('Monopoly',
     '2020-04-14 19:00:00',
     1),
    ('Uno',
     '2020-04-15 19:00:00',
    2);

INSERT INTO tallyit_player_scores (player_name, score, game_id, group_id, date_created)
VALUES
    ('Mom', 1, 1, 1, '2020-04-10 19:00:00'),
    ('Dad', 0, 1, 1, '2020-04-10 19:00:00'),
    ('Grandma', 300, 2, 1, '2020-04-12 19:00:00'),
    ('Luke', 500, 2, 1, '2020-04-12 19:00:00'),
    ('Leia', 500, 2, 1, '2020-04-12 19:00:00'),
    ('Grandpa', 300, 2, 1, '2020-04-12 19:00:00'),
    ('Grandpa', 3100, 3, 1, '2020-04-14 19:00:00'),
    ('Luke', 5000, 3, 1, '2020-04-14 19:00:00'),
    ('Leia',6500, 3, 1, '2020-04-14 19:00:00'),
    ('Nala', 3500, 3, 1, '2020-04-14 19:00:00'),
    ('Bill', 5, 4, 2, '2020-04-15 19:00:00'),
    ('Ben', 3, 4, 2, '2020-04-15 19:00:00'),
    ('Polly', 4, 4, 2, '2020-04-15 19:00:00');

COMMIT; 