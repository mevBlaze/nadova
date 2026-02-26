import { createClient } from '@/lib/supabase/client';

const BUCKET = 'qr-assets';

export async function uploadFile(
  file: File,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  await supabase.storage.from(BUCKET).remove([path]);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl, error: null };
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
