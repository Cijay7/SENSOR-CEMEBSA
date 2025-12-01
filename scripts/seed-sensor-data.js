/**
 * Script untuk mengirim dummy data sensor ke Supabase
 * 
 * Penggunaan:
 *   npm run seed-data
 * 
 * Script ini akan mengirim 24 jam data sensor historis
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate dummy sensor data
function generateSensorData(hoursAgo) {
  const now = new Date();
  const time = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  
  return {
    timestamp: time.toISOString(),
    temperature: 22 + Math.random() * 8 + Math.sin(hoursAgo / 4) * 3,
    humidity: 45 + Math.random() * 20 + Math.cos(hoursAgo / 4) * 5,
    pressure: 1010 + Math.random() * 10 + Math.sin(hoursAgo / 6) * 5,
    light: Math.max(0, 500 + Math.sin((hoursAgo - 6) / 4) * 400 + Math.random() * 100),
  };
}

async function seedData() {
  try {
    console.log('📊 Mulai seed data sensor...');
    
    // Generate 24 jam data (setiap jam)
    const dataToInsert = [];
    for (let i = 23; i >= 0; i--) {
      dataToInsert.push(generateSensorData(i));
    }
    
    console.log(`📝 Menyiapkan ${dataToInsert.length} data untuk dikirim...`);
    
    // Insert ke Supabase
    const { data, error } = await supabase
      .from('sensor_data')
      .insert(dataToInsert)
      .select();
    
    if (error) {
      console.error('❌ Error saat insert data:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ Berhasil mengirim ${data?.length || 0} data sensor`);
    console.log('📍 Data sudah tersimpan di tabel sensor_data');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedData();
