const BASE_URL = 'http://localhost:8000/api';

const getHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };

    // 💡 لو الداتا مش FormData، حط الـ Content-Type كـ JSON
    // لو FormData، سيبها فاضية عشان المتصفح يحط الـ Boundary الصح
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

export const api = {
    async get(endpoint, params = {}) {

        const queryString = Object.keys(params).length
            ? '?' + new URLSearchParams(params).toString()
            : '';

        const response = await fetch(`${BASE_URL}${endpoint}${queryString}`, { // 👈 أضفنا الـ queryString هنا
            headers: getHeaders()
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('role');
            window.location.href = '/login';
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return response.json();
    },


    async post(endpoint, data) {
        const isFormData = data instanceof FormData;

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(isFormData),
            body: isFormData ? data : JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return response.json();
    },


    async put(endpoint, data) {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(isFormData),
            body: isFormData ? data : JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return response.json();
    },

    async patch(endpoint, data) {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(isFormData),
            body: isFormData ? data : JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return response.json();
    },

    async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}
};