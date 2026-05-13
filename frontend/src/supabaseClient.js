import { createClient } from '@supabase/supabase-js';

// Vercel-də daxil etdiyin Environment Variables məlumatlarını oxuyur
// Bu, kodun içindəki gizli məlumatların kənardan görünməsinin qarşısını alır
const supabaseUrl = process.env.supabaseUrl || "https://sqgphrdkthiixeikialy.supabase.co";
const supabaseKey = process.env.supabaseKey || "sb_publishable_ysE34rB_P609-Mw6u_Tcug_JNZRylrq";

// Client-in yaradılması
export const supabase = createClient(supabaseUrl, supabaseKey);

/** 
 * Bu faylı yaratdıqdan sonra digər fayllarda belə çağıracaqsan:
 * import { supabase } from './supabaseClient';
 */