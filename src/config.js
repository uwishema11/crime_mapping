// Configuration settings for the application
const config = {
    // API configuration
    api: {
        baseUrl: 'http://localhost:3000', // Replace with your actual API base URL
    },

    // Map configuration
    map: {
        defaultCenter: { lat: 0, lng: 0 }, // Replace with your desired default center
        defaultZoom: 13,
        maxZoom: 18,
        minZoom: 3
    },

    // File upload configuration
    fileUpload: {
        maxSize: 5, // Size in MB
        allowedTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    },

    // Feature flags
    features: {
        attachments: true,
        comments: true,
        realTimeUpdates: false,
    },

    // Report form configuration
    reportForm: {
        crimeTypes: [
            'Theft',
            'Assault',
            'Vandalism',
            'Burglary',
            'Robbery',
            'Drug-related',
            'Fraud',
            'Other'
        ],
        severityLevels: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' }
        ],
        validation: {
            descriptionMinLength: 20,
            descriptionMaxLength: 1000,
            phoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        endpoints: {
            submit: '/api/reports',
            upload: '/api/uploads'
        },
        defaultValues: {
            type: '',
            severity: 'medium',
            location: '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            description: '',
            isAnonymous: false,
            contactInfo: {
                name: '',
                email: '',
                phone: ''
            }
        }
    }
};

export default config;

// You can add more configuration sections as needed 