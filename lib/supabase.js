import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzlawvgioayoalcrfzwk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bGF3dmdpb2F5b2FsY3JmendrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTUxNjMsImV4cCI6MjA2MjI5MTE2M30.vNdnH8tPeRikwazYYaIFA93sV8UNrOm1LonJKlNq6IM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);