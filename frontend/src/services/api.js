// API Service Layer connecting via API Gateway (Default: http://localhost:8080)

let GATEWAY_URL = localStorage.getItem('GATEWAY_URL') || 'http://localhost:8080';
let API_KEY = localStorage.getItem('API_KEY') || 'blood_donation_secret_key_2026';
let OAUTH_TOKEN = localStorage.getItem('OAUTH_TOKEN') || null;

export const getGatewayConfig = () => ({
  gatewayUrl: GATEWAY_URL,
  apiKey: API_KEY,
  token: OAUTH_TOKEN,
});

export const setGatewayConfig = (config) => {
  if (config.gatewayUrl) {
    GATEWAY_URL = config.gatewayUrl;
    localStorage.setItem('GATEWAY_URL', GATEWAY_URL);
  }
  if (config.apiKey !== undefined) {
    API_KEY = config.apiKey;
    localStorage.setItem('API_KEY', API_KEY);
  }
  if (config.token !== undefined) {
    OAUTH_TOKEN = config.token;
    if (OAUTH_TOKEN) localStorage.setItem('OAUTH_TOKEN', OAUTH_TOKEN);
    else localStorage.removeItem('OAUTH_TOKEN');
  }
};

// Initial Mock State for full functionality even if backend gateway is offline
export const initialInventory = [
  { bloodType: 'A+', units: 45, lastUpdated: '2026-08-10 18:30', status: 'Healthy', location: 'Central Blood Bank' },
  { bloodType: 'A-', units: 12, lastUpdated: '2026-08-10 14:15', status: 'Warning', location: 'Central Blood Bank' },
  { bloodType: 'B+', units: 38, lastUpdated: '2026-08-10 19:00', status: 'Healthy', location: 'East Wing Vault' },
  { bloodType: 'B-', units: 8, lastUpdated: '2026-08-10 11:20', status: 'Critical', location: 'East Wing Vault' },
  { bloodType: 'AB+', units: 22, lastUpdated: '2026-08-10 16:45', status: 'Healthy', location: 'Central Blood Bank' },
  { bloodType: 'AB-', units: 5, lastUpdated: '2026-08-10 09:30', status: 'Critical', location: 'Central Blood Bank' },
  { bloodType: 'O+', units: 60, lastUpdated: '2026-08-10 20:00', status: 'Healthy', location: 'General Hospital Hub' },
  { bloodType: 'O-', units: 4, lastUpdated: '2026-08-10 21:10', status: 'Critical', location: 'General Hospital Hub' },
];

export const initialDonors = [
  { id: 'DON-101', name: 'Kasun Perera', bloodType: 'O+', city: 'Colombo', phone: '+94 77 123 4567', email: 'kasun@gmail.com', age: 28, weight: 72, eligible: true, lastDonated: '2026-04-12', totalDonations: 6 },
  { id: 'DON-102', name: 'Dilhani Silva', bloodType: 'A-', city: 'Kandy', phone: '+94 71 987 6543', email: 'dilhani@yahoo.com', age: 24, weight: 58, eligible: true, lastDonated: '2026-01-20', totalDonations: 3 },
  { id: 'DON-103', name: 'Nuwan Fernando', bloodType: 'B+', city: 'Galle', phone: '+94 75 456 7890', email: 'nuwan@outlook.com', age: 32, weight: 80, eligible: false, lastDonated: '2026-07-15', totalDonations: 12 },
  { id: 'DON-104', name: 'Sahan Jayawardena', bloodType: 'O-', city: 'Colombo', phone: '+94 70 333 2211', email: 'sahan@gmail.com', age: 29, weight: 68, eligible: true, lastDonated: '2026-02-10', totalDonations: 8 },
  { id: 'DON-105', name: 'Anusha Ranasinghe', bloodType: 'AB+', city: 'Kurunegala', phone: '+94 76 888 9900', email: 'anusha@gmail.com', age: 30, weight: 63, eligible: true, lastDonated: '2026-03-05', totalDonations: 4 },
];

export const initialRequests = [
  { id: 'REQ-501', recipientName: 'Saman Kumara', bloodType: 'O-', units: 3, urgency: 'CRITICAL', hospital: 'National Hospital Colombo', city: 'Colombo', contact: '+94 71 222 3344', status: 'MATCHING', createdAt: '2026-08-10 20:30' },
  { id: 'REQ-502', recipientName: 'Malini Wickramasinghe', bloodType: 'A+', units: 2, urgency: 'HIGH', hospital: 'Teaching Hospital Kandy', city: 'Kandy', contact: '+94 77 444 5566', status: 'PENDING', createdAt: '2026-08-10 19:15' },
  { id: 'REQ-503', recipientName: 'Sunil Shantha', bloodType: 'B+', units: 1, urgency: 'NORMAL', hospital: 'Karapitiya Hospital Galle', city: 'Galle', contact: '+94 78 999 1122', status: 'FULFILLED', createdAt: '2026-08-10 14:00' },
];

export const initialNotifications = [
  { id: 'NOTIF-01', type: 'EMERGENCY', title: 'Critical O- Blood Shortage Alert', message: 'Urgent request for 3 units O- at National Hospital Colombo.', recipient: 'Registered O- Donors in Colombo', time: '10 mins ago', status: 'SENT' },
  { id: 'NOTIF-02', type: 'MATCH', title: 'Donor Match Found', message: 'Donor Sahan Jayawardena (DON-104) matched for Request REQ-501.', recipient: 'National Hospital Colombo', time: '25 mins ago', status: 'DELIVERED' },
  { id: 'NOTIF-03', type: 'SYSTEM', title: 'Inventory Stock Updated', message: 'Added 10 units of O+ blood to General Hospital Hub.', recipient: 'System Admin', time: '2 hours ago', status: 'SYSTEM' },
];

// Generic Fetch Wrapper targeting API Gateway with authorization headers
async function fetchFromGateway(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY,
    ...(OAUTH_TOKEN ? { Authorization: `Bearer ${OAUTH_TOKEN}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${GATEWAY_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) throw new Error(`Gateway returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Gateway API unavailable at ${GATEWAY_URL}${endpoint}. Using mock response. (${err.message})`);
    return null; // Signals fallback to caller
  }
}

// 1. Auth Service Endpoints (/auth)
export const apiAuth = {
  login: async (credentials) => {
    const data = await fetchFromGateway('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data && data.token) {
      setGatewayConfig({ token: data.token });
      return data;
    }
    const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(7);
    setGatewayConfig({ token: mockToken });
    return { token: mockToken, user: { email: credentials.email, role: 'DONOR' } };
  },
  register: async (userData) => {
    const data = await fetchFromGateway('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data) return data;
    return { success: true, message: 'User registered successfully via User & Auth Service' };
  },
  getProfile: async () => {
    return await fetchFromGateway('/auth/profile') || { email: 'donor@example.com', role: 'DONOR' };
  }
};

// 2. Donor Service Endpoints (/donors)
export const apiDonors = {
  getAll: async () => {
    const data = await fetchFromGateway('/donors');
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map(d => ({
        ...d,
        city: d.location || d.city || 'Colombo',
        eligible: d.eligibilityStatus === 'ELIGIBLE' || d.eligible === true,
        totalDonations: d.totalDonations || 1
      }));
    }
    return initialDonors;
  },
  getById: async (id) => {
    return await fetchFromGateway(`/donors/${id}`) || initialDonors.find(d => d.id === id);
  },
  getHistory: async (id) => {
    return await fetchFromGateway(`/donors/history?donorId=${id}`) || [
      { id: 'DON-HIST-1', date: '2026-04-12', units: 1, location: 'National Blood Center', status: 'Completed' },
      { id: 'DON-HIST-2', date: '2025-11-05', units: 1, location: 'Colombo South Teaching Hospital', status: 'Completed' }
    ];
  },
  create: async (donor) => {
    const payload = {
      name: donor.name,
      email: donor.email,
      phone: donor.phone,
      bloodType: donor.bloodType,
      location: donor.city || donor.location || 'Colombo',
      eligibilityStatus: donor.eligible !== false ? 'ELIGIBLE' : 'INELIGIBLE'
    };
    const data = await fetchFromGateway('/donors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data) {
      return {
        ...data,
        city: data.location || data.city || 'Colombo',
        eligible: data.eligibilityStatus === 'ELIGIBLE' || data.eligible === true,
        totalDonations: donor.totalDonations || 1
      };
    }
    return { ...donor, id: `DON-${Math.floor(100 + Math.random() * 900)}` };
  }
};

// 3. Inventory Service Endpoints (/inventory)
export const apiInventory = {
  getAll: async () => {
    const data = await fetchFromGateway('/inventory');
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return initialInventory;
  },
  getByBloodType: async (bloodType) => {
    return await fetchFromGateway(`/inventory/${encodeURIComponent(bloodType)}`) || initialInventory.find(i => i.bloodType === bloodType);
  },
  updateStock: async (updateData) => {
    const payload = {
      bloodType: updateData.bloodType,
      amount: parseInt(updateData.amount, 10),
      timestamp: new Date().toISOString()
    };
    const data = await fetchFromGateway('/inventory/update', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data || { success: true, message: `Stock for ${updateData.bloodType} updated.` };
  }
};

// 4. Request & Matching Service Endpoints (/requests)
export const apiRequests = {
  getAll: async () => {
    const data = await fetchFromGateway('/requests');
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return initialRequests;
  },
  create: async (requestData) => {
    const payload = {
      recipientName: requestData.recipientName,
      bloodType: requestData.bloodType,
      units: parseInt(requestData.units, 10) || 1,
      urgency: requestData.urgency || 'NORMAL',
      hospital: requestData.hospital || 'General Hospital',
      city: requestData.city || 'Colombo',
      contact: requestData.contact || '+94 77 123 4567'
    };
    const data = await fetchFromGateway('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data || { ...requestData, id: `REQ-${Math.floor(500 + Math.random() * 400)}`, status: 'PENDING', createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) };
  },
  matchDonors: async (requestId) => {
    const data = await fetchFromGateway(`/requests/match?requestId=${requestId}`);
    if (data) return data;
    return initialDonors.filter(d => d.eligible);
  }
};

// 5. Notification Service Endpoints (/notify)
export const apiNotifications = {
  getAll: async () => {
    const data = await fetchFromGateway('/notify/alerts');
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map(n => ({
        id: n.id || `NOTIF-${Math.floor(10 + Math.random() * 90)}`,
        type: n.type || 'SYSTEM',
        title: n.subject || 'System Notification',
        message: n.message,
        recipient: n.recipientContact || 'System Admin',
        time: n.sentAt || 'Just now',
        status: n.status || 'SENT'
      }));
    }
    return initialNotifications;
  },
  sendEmail: async (emailPayload) => {
    const payload = {
      recipientEmail: emailPayload.to || emailPayload.recipientEmail,
      subject: emailPayload.subject || 'Blood Donation Alert',
      message: emailPayload.message
    };
    return await fetchFromGateway('/notify/email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) || { success: true, message: `Email sent to ${payload.recipientEmail}` };
  },
  sendSms: async (smsPayload) => {
    const payload = {
      recipientPhone: smsPayload.phone || smsPayload.recipientPhone,
      message: smsPayload.message
    };
    return await fetchFromGateway('/notify/sms', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) || { success: true, message: `SMS alert dispatched to ${payload.recipientPhone}` };
  }
};
