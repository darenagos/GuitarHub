// jest.setup.js

// Mock the VITE_* environment variables
process.env.VITE_SUPABASE_URL = "https://keuwdaentqcoivngupxm.supabase.co";
process.env.VITE_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldXdkYWVudHFjb2l2bmd1cHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMDY4OTQsImV4cCI6MjA1NjY4Mjg5NH0.n9iIUOG-IDIeNTQIv1DKLKaYmj0CevP2mLYEi0tImmc";

// Mock the TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Import jest-dom to extend jest matchers
import "@testing-library/jest-dom";
