import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnunnduirmqygmvwkevp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudW5uZHVpcm1xeWdtdndrZXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTM0OTgsImV4cCI6MjA2MTY4OTQ5OH0.p8YOvBzwtYOuxxPcvF42EhB1xwy8WZmkpgm5QM1-U1Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);