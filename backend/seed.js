const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Import Models
const Item = require('./models/Item');
const User = require('./models/User');
const Location = require('./models/Location');
const Event = require('./models/Event');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // 1. Wipe Collections
    await Item.deleteMany({});
    await User.deleteMany({});
    await Location.deleteMany({});
    await Event.deleteMany({});
    console.log('Database cleared of old data.');

    // 2. Seed Locations
    const locations = await Location.insertMany([
      { name: 'Receiving Dock' },
      { name: 'Warehouse Shelf A' },
      { name: 'Assembly Floor' },
      { name: 'Quality Control' },
      { name: 'Shipping Bay' },
      { name: 'Main Office' }
    ]);
    console.log(`${locations.length} locations created.`);

    // 3. Seed Users (Admin + the Fab Four)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin', password: hashedPassword, role: 'admin' },
      { name: 'John', password: hashedPassword, role: 'staff' },
      { name: 'Paul', password: hashedPassword, role: 'staff' },
      { name: 'George', password: hashedPassword, role: 'staff' },
      { name: 'Ringo', password: hashedPassword, role: 'staff' }
    ]);
    console.log(`${users.length} users created (Passwords: password123).`);

    // 4. Seed Items (Standardized Lowercase Status & camelCase Type)
    const items = await Item.insertMany([
      {
        name: 'Industrial Robotic Arm',
        solutionType: 'asset',
        status: 'active',
        currentLocation: { _id: locations[2]._id, name: locations[2].name },
        lastUpdatedBy: { _id: users[0]._id, name: users[0].name, role: users[0].role }
      },
      {
        name: 'Box of 10mm Bolts',
        solutionType: 'inventory',
        status: 'active',
        currentLocation: { _id: locations[1]._id, name: locations[1].name },
        lastUpdatedBy: { _id: users[1]._id, name: users[1].name, role: users[1].role }
      },
      {
        name: 'Engine Assembly #402',
        solutionType: 'workOrder', // FIXED: camelCase
        status: 'active',
        currentLocation: { _id: locations[0]._id, name: locations[0].name },
        lastUpdatedBy: { _id: users[2]._id, name: users[2].name, role: users[2].role }
      },
      {
        name: 'Hydraulic Press',
        solutionType: 'asset',
        status: 'missing',
        currentLocation: { _id: locations[3]._id, name: locations[3].name },
        lastUpdatedBy: { _id: users[3]._id, name: users[3].name, role: users[3].role }
      },
      {
        name: 'Circuit Board Batch B',
        solutionType: 'inventory',
        status: 'active',
        currentLocation: { _id: locations[1]._id, name: locations[1].name },
        lastUpdatedBy: { _id: users[4]._id, name: users[4].name, role: users[4].role }
      }
    ]);
    console.log(`${items.length} items created.`);

    // 5. Create Initial Audit Trail Events
    const initialEvents = items.map(item => ({
      itemId: item._id,
      user: item.lastUpdatedBy,
      location: item.currentLocation,
      action: 'received'
    }));

    await Event.insertMany(initialEvents);
    console.log('Initial history events logged.');

    console.log('--- SEEDING SUCCESSFUL ---');
    process.exit();
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();