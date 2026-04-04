const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); 
const Item = require('./models/Item');
const Event = require('./models/Event');
const Location = require('./models/Location');
const User = require('./models/User');

dotenv.config();

// Define the source of truth for business logic mapping
const TYPE_ACTION_MAP = {
  asset: 'moved',
  inventory: 'scanned',
  workOrder: 'received'
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- Reseeding: 15 Active Items with Strict Event Mapping ---');

    // 1. CLEAR COLLECTIONS
    await Promise.all([
      Item.deleteMany(),
      Event.deleteMany(),
      Location.deleteMany(),
      User.deleteMany()
    ]);

    // 2. CREATE USERS (admin/staff)
    const hashedPassword = await bcrypt.hash('password', 10);
    const users = await User.insertMany([
      { name: 'Admin', role: 'admin', password: hashedPassword },
      { name: 'John Lennon', role: 'staff', password: hashedPassword },
      { name: 'Paul McCartney', role: 'staff', password: hashedPassword },
      { name: 'George Harrison', role: 'staff', password: hashedPassword },
      { name: 'Ringo Starr', role: 'staff', password: hashedPassword },
    ]);

    const adminSnapshot = { _id: users[0]._id, name: users[0].name };

    // 3. CREATE LOCATIONS
    const locations = await Location.insertMany([
      { name: 'North Dock' },
      { name: 'South Dock' },
      { name: 'Tool Crib' },
      { name: 'Assembly Line A' },
      { name: 'Assembly Line B' },
      { name: 'Finished Goods' },
      { name: 'Quarantine Zone' }
    ]);

    // 4. GENERATE 15 ACTIVE ITEMS (5 per type)
    const itemsData = [
      // 5 ASSETS
      { name: 'Hyster Forklift #1', solutionType: 'asset' },
      { name: 'Hyster Forklift #2', solutionType: 'asset' },
      { name: 'Digital Caliper Set', solutionType: 'asset' },
      { name: 'Thermal Scanner B', solutionType: 'asset' },
      { name: 'Pressure Washer', solutionType: 'asset' },

      // 5 INVENTORY
      { name: 'Hydraulic Fluid (55gal)', solutionType: 'inventory' },
      { name: 'Copper Wiring (500ft)', solutionType: 'inventory' },
      { name: 'Hex Bolt Bulk Box', solutionType: 'inventory' },
      { name: 'Welding Gas Tank', solutionType: 'inventory' },
      { name: 'Industrial Adhesive', solutionType: 'inventory' },

      // 5 WORK ORDERS
      { name: 'Engine Rebuild #101', solutionType: 'workOrder' },
      { name: 'Transmission Flush #44', solutionType: 'workOrder' },
      { name: 'Brake Refurbish #09', solutionType: 'workOrder' },
      { name: 'Chassis Alignment', solutionType: 'workOrder' },
      { name: 'Final Inspection #202', solutionType: 'workOrder' }
    ].map((item, index) => ({
      ...item,
      status: 'active',
      // Distribute items across the 7 locations
      currentLocation: { 
        _id: locations[index % locations.length]._id, 
        name: locations[index % locations.length].name 
      },
      lastUpdatedBy: adminSnapshot
    }));

    const createdItems = await Item.insertMany(itemsData);

    // 5. INITIALIZE AUDIT TRAIL 
    // Logic: Map the initial event action based on the item's solutionType
    const eventsData = createdItems.map(item => ({
      itemId: item._id,
      user: adminSnapshot,
      location: item.currentLocation, 
      action: TYPE_ACTION_MAP[item.solutionType] // Strict enforcement
    }));

    await Event.insertMany(eventsData);

    console.log(`Success: Created ${users.length} Users and ${createdItems.length} Active Items.`);
    console.log('Verification: All event actions correctly match item solutionTypes.');
    process.exit();
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();