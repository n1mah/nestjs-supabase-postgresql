import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!,
    );
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;

    const { error } = await this.supabase.storage
      .from('images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw new Error('Upload failed: ' + error.message);

    const { data } = this.supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}
