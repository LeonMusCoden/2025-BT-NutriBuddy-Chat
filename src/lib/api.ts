const API_BASE_URL = 'https://diet-coach.interactions.ics.unisg.ch/nutribuddy/backend';
const AUTH_CREDENTIALS = 'Basic bnV0cmlidWRkeTpNMjZ2NFkzdUxoR3U=';

export interface UserRegistrationData {
  email: string;
  password: string;
  connectedLoyaltyCard?: 'Migros' | 'Coop' | 'Both' | null;
  migrosEmail?: string;
  migrosPassword?: string;
  coopEmail?: string;
  coopPassword?: string;
  profileData?: Record<string, any>;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  register_time: number;
  external_id: string;
  token: string;
  connected_loyalty_card?: string | null;
  profile_data?: Record<string, any>;
}

export class NutriBuddyApi {
  private authToken: string | null = null;

  // Helper method to create headers with authentication
  private getHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': AUTH_CREDENTIALS,
      ...additionalHeaders
    };
    
    // Add auth token if available
    if (this.authToken) {
      headers['Authentication'] = this.authToken;
    }
    
    return headers;
  }

  // Set the authentication token (after login/signup)
  public setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

  // Load the authentication token from localStorage (on app init)
  public loadAuthToken(): string | null {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.authToken = token;
    }
    return token;
  }

  // Clear the authentication token (on logout)
  public clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
  }

  // Register a new user
  public async registerUser(userData: UserRegistrationData): Promise<UserInfo> {
    const response = await fetch(`${API_BASE_URL}/user/register-minimal`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.setAuthToken(data.token);
    return data;
  }

  // Login an existing user
  public async login(credentials: UserLoginData): Promise<UserInfo> {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.setAuthToken(data.token);
    return data;
  }

  // Get current user information
  public async getCurrentUser(): Promise<UserInfo> {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get user data: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Update user profile data
  public async updateProfileData(profileData: Record<string, any>): Promise<void> {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/user/update-profile-data`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
    }
  }

  // Validate credentials
  public async validateCredentials(retailer: 'migros' | 'coop', email: string, password: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/collector-api`, {
      method: 'GET',
      headers: this.getHeaders({
        'endpoint': `/validate/${retailer}-credentials`,
        [`${retailer}-email`]: email,
        [`${retailer}-password`]: password
      })
    });

    return response.ok;
  }

  // Start scraper for the current user
  public async startScraper(retailer: 'migros' | 'coop'): Promise<void> {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/collector-api`, {
      method: 'POST',
      headers: this.getHeaders({
        'endpoint': `/user/update-${retailer}`
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to start scraper: ${response.status} ${response.statusText}`);
    }
  }
}

// Create a singleton instance of the API client
export const nutriBuddyApi = new NutriBuddyApi();
