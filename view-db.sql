\c nc_games

UPDATE reviews SET votes = votes - 5 
    WHERE review_id = 1 RETURNING*;