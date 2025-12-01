/**
 * Script untuk mengirim data sensor realtime secara berkala ke Supabase
 * 
 * Penggunaan:
 *   npm run realtime-data
 * 
 * Script ini akan mengirim data sensor baru setiap 10 detik
 * Tekan Ctrl+C untuk menghentikan
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

// Generate realtime sensor data
function generateRealtimeData() {
  return {
    timestamp: new Date().toISOString(),
    temperature: 22 + Math.random() * 8,
    humidity: 45 + Math.random() * 20,
    pressure: 1010 + Math.random() * 10,
    light: 300 + Math.random() * 400,
  };
}

// Format data untuk display
function formatSensorData(data) {
  return {
    'Timestamp': new Date(data.timestamp).toLocaleString('id-ID'),
    'Suhu': `${data.temperature.toFixed(2)}°C`,
    'Kelembaban': `${data.humidity.toFixed(2)}%`,
    'Tekanan': `${data.pressure.toFixed(2)} hPa`,
    'Cahaya': `${data.light.toFixed(2)} lux`,
  };
}

let dataCount = 0;

async function sendRealtimeData() {
  try {
    const sensorData = generateRealtimeData();
    
    const { data, error } = await supabase
      .from('sensor_data')
      .insert([sensorData])
      .select();
    
    if (error) {
      console.error('❌ Error saat insert data:', error.message);
      return;
    }
    
    dataCount++;
    console.log(`\n📡 Data #${dataCount} dikirim:`);
    console.table(formatSensorData(sensorData));
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

console.log('🚀 Mulai mengirim data sensor realtime...');
console.log('⏱️  Interval: 10 detik');
console.log('🛑 Tekan Ctrl+C untuk menghentikan\n');

// Send data setiap 10 detik
const interval = setInterval(sendRealtimeData, 10000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✅ Menghentikan pengiriman data...');
  clearInterval(interval);
  console.log(`📊 Total data terkirim: ${dataCount}`);
  process.exit(0);
});
