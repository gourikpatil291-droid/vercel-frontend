const axios = require('axios');

async function test() {
    try {
        const uniqueEmail = `test_${Date.now()}@example.com`;
        console.log('Registering', uniqueEmail);
        
        await axios.post('https://backend-smoky-zeta-1h0drgr8cx.vercel.app/api/auth/register', {
            name: 'Test',
            email: uniqueEmail,
            mobile: `99999${Math.floor(Math.random()*90000)}`,
            employee_id: `E${Math.floor(Math.random()*90000)}`,
            address: 'Test',
            role: 'Manager',
            password: 'password123'
        });
        
        console.log('Logging in...');
        const res = await axios.post('https://backend-smoky-zeta-1h0drgr8cx.vercel.app/api/auth/login', {
            loginId: uniqueEmail,
            password: 'password123'
        });
        console.log('Login Response:', res.data);
    } catch (e) {
        console.log('Error Response:', e.response ? e.response.data : e.message);
    }
}

test();
