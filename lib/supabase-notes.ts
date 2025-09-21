// Supabase integration for storing notes
export interface NoteSubmission {
  filename: string;
  content: string;
  user_name: string;
  user_email?: string;
}

export class SupabaseNotesService {
  private projectUrl: string;
  private apiKey: string;

  constructor() {
    // These would typically come from environment variables in production
    this.projectUrl = 'https://shhtbchukbhzfmopskvt.supabase.co';
    this.apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  }

  async saveNote(noteData: NoteSubmission): Promise<void> {
    try {
      const response = await fetch(`${this.projectUrl}/rest/v1/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
          'Authorization': `Bearer ${this.apiKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          'note content': noteData.content,
          'user_name': noteData.user_name,
          'user_email': noteData.user_email || null
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save note: ${response.status} ${errorText}`);
      }

      console.log('Note saved successfully to Supabase');
    } catch (error) {
      console.error('Error saving note to Supabase:', error);
      throw error;
    }
  }

  async getAllNotes(): Promise<any[]> {
    try {
      const response = await fetch(`${this.projectUrl}/rest/v1/portfolio?select=*`, {
        headers: {
          'apikey': this.apiKey,
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notes from Supabase:', error);
      throw error;
    }
  }
}

// User input modal component for collecting name and email
export interface UserInfo {
  name: string;
  email?: string;
}

export function promptForUserInfo(): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
    const name = prompt('Enter your name (required):');

    if (!name || name.trim().length === 0) {
      reject(new Error('Name is required'));
      return;
    }

    const email = prompt('Enter your email (optional):') || undefined;

    resolve({
      name: name.trim(),
      email: email && email.trim().length > 0 ? email.trim() : undefined
    });
  });
}