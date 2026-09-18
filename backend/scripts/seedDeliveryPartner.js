import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import Delivery from '../app/models/delivery.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function seedDeliveryPartner() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const phone = '9111966732';
    let partner = await Delivery.findOne({ 
      phone: { $in: [phone, `+91${phone}`] } 
    });

    if (partner) {
      partner.phone = phone;
      partner.name = partner.name || 'Delivery Partner';
      partner.isVerified = true;
      partner.isOnline = true;
      partner.role = 'delivery';
      partner.vehicleType = partner.vehicleType || 'bike';
      partner.vehicleNumber = partner.vehicleNumber || 'MP09AB1234';
      partner.drivingLicenseNumber = partner.drivingLicenseNumber || 'DL1234567890';
      await partner.save();
      console.log('Updated existing delivery partner:', partner._id, partner.phone);
    } else {
      partner = await Delivery.create({
        name: 'Delivery Partner',
        phone,
        vehicleType: 'bike',
        email: 'delivery@anitamegamart.com',
        vehicleNumber: 'MP09AB1234',
        drivingLicenseNumber: 'DL1234567890',
        isVerified: true,
        isOnline: true,
        role: 'delivery',
        location: {
          type: 'Point',
          coordinates: [75.8577, 22.7196],
        },
      });
      console.log('Created delivery partner:', partner._id, partner.phone);
    }

    process.exit(0);
  } catch (err) {
    console.error('Failed to seed delivery partner:', err);
    process.exit(1);
  }
}

seedDeliveryPartner();
