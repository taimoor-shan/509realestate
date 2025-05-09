// This script initializes the PostgreSQL database with the schema
// It can be run manually with: node scripts/migrate-pg.js

import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';

async function migrate() {
  console.log('Starting PostgreSQL migration...');
  
  // Create a PostgreSQL client
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
    
    // Check if sessions table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sessions'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating database tables...');
      
      // Create tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          session_id TEXT PRIMARY KEY,
          expires TIMESTAMP NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS pages (
          page_id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMP NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS counters (
          counter_id TEXT PRIMARY KEY,
          count INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS assets (
          asset_id TEXT PRIMARY KEY,
          mime_type TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT NULL,
          size INTEGER NOT NULL,
          data BYTEA NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS articles (
          article_id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          teaser TEXT NOT NULL,
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          published_at TIMESTAMP,
          updated_at TIMESTAMP
        );
      `);
      
      console.log('Database tables created successfully');
    } else {
      console.log('Database tables already exist');
    }
    
    // Verify tables were created
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables in database:');
    tables.rows.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
