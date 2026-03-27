import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "travel.db");
const sqlite = new Database(dbPath);

sqlite.exec(`
  INSERT OR IGNORE INTO experiences (id, name, description, city, country, ideal_seasons, ideal_partner_types, estimated_days, status, created_at) VALUES
  (1, 'Attend Carnival', 'Experience the world-famous Rio Carnival with parades, samba, and street parties', 'Rio de Janeiro', 'Brazil', 'summer', 'friends,romantic', 5, 'wishlist', '2024-01-15T00:00:00.000Z'),
  (2, 'Cherry Blossom Season', 'Walk through ancient temples surrounded by sakura blossoms', 'Kyoto', 'Japan', 'spring', 'solo,romantic', 4, 'wishlist', '2024-02-10T00:00:00.000Z'),
  (3, 'Northern Lights', 'Witness the aurora borealis from a glass igloo', 'Rovaniemi', 'Finland', 'winter', 'solo,romantic', 3, 'wishlist', '2024-03-05T00:00:00.000Z'),
  (4, 'Safari Adventure', 'See the Big Five on a guided safari through the Serengeti', 'Serengeti', 'Tanzania', 'summer,autumn', 'friends,family', 7, 'wishlist', '2024-04-20T00:00:00.000Z'),
  (5, 'Amalfi Coast Road Trip', 'Drive along the stunning coastal roads of southern Italy', 'Amalfi', 'Italy', 'spring,summer', 'romantic,friends', 5, 'visited', '2024-05-12T00:00:00.000Z'),
  (6, 'Explore Marrakech Souks', 'Get lost in the vibrant markets and riads of the old medina', 'Marrakech', 'Morocco', 'spring,autumn', 'solo,friends', 3, 'visited', '2024-06-01T00:00:00.000Z'),
  (7, 'Glacier Hiking', 'Trek across ancient glaciers with stunning mountain views', 'Reykjavik', 'Iceland', 'summer', 'solo,friends', 2, 'wishlist', '2024-07-15T00:00:00.000Z'),
  (8, 'Christmas Markets', 'Wander through traditional Christmas markets with mulled wine', 'Vienna', 'Austria', 'winter', 'romantic,family', 3, 'wishlist', '2024-08-20T00:00:00.000Z')
`);

console.log("Seed data inserted successfully!");
sqlite.close();
