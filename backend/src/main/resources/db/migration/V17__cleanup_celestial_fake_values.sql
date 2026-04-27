-- Migration to clean up fake 0.0 values in weather_node_celestial table
-- These values were likely inserted by a previous buggy version of the sync logic.

UPDATE weather_node_celestial
SET sunrise_azimuth = NULL
WHERE sunrise_azimuth = 0.0;

UPDATE weather_node_celestial
SET sunset_azimuth = NULL
WHERE sunset_azimuth = 0.0;

UPDATE weather_node_celestial
SET solarnoon_elevation = NULL
WHERE solarnoon_elevation = 0.0;

UPDATE weather_node_celestial
SET solarmidnight_elevation = NULL
WHERE solarmidnight_elevation = 0.0;

UPDATE weather_node_celestial
SET moonrise_azimuth = NULL
WHERE moonrise_azimuth = 0.0;

UPDATE weather_node_celestial
SET moonset_azimuth = NULL
WHERE moonset_azimuth = 0.0;

UPDATE weather_node_celestial
SET high_moon_elevation = NULL
WHERE high_moon_elevation = 0.0;

UPDATE weather_node_celestial
SET low_moon_elevation = NULL
WHERE low_moon_elevation = 0.0;

UPDATE weather_node_celestial
SET moonphase = NULL
WHERE moonphase = 0.0;
