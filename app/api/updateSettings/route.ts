import { NextRequest, NextResponse } from 'next/server';
import { APISettings } from '@/lib/types';
import { saveApiSettingsToDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { apiSettings } = await request.json();

    if (!apiSettings) {
      throw new Error('API settings not provided');
    }

    await saveApiSettingsToDatabase(apiSettings);

    return NextResponse.json({ message: 'API settings updated successfully' });
  } catch (error) {
    console.error('Error updating API settings:', error);
    return NextResponse.json({ error: error.message || 'Failed to update API settings' }, { status: 500 });
  }
}
