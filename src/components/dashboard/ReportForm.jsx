import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Calendar, AlertTriangle, FileText, Upload, X, Loader2, Map, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { mapsConfig, validateMapsConfig } from '../../config/maps';
import config from '../../config';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAX_FILE_COUNT = config.reportForm.fileUpload?.maxFiles || 5;
const MAX_FILE_SIZE = config.reportForm.fileUpload?.maxSize || 5 * 1024 * 1024; // Default 5MB
const ALLOWED_FILE_TYPES = config.reportForm.fileUpload?.allowedTypes || ['image/*', 'application/pdf'];
const libraries = ["places"];

const initialFormData = {
    ...config.reportForm.defaultValues,
    coordinates: { lat: null, lng: null }
};

const ReportForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [mapError, setMapError] = useState(null);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [isMapsEnabled, setIsMapsEnabled] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [autocomplete, setAutocomplete] = useState(null);
    const [mapCenter, setMapCenter] = useState(mapsConfig.defaultCenter);
    const [formData, setFormData] = useState(initialFormData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDirty, setIsDirty] = useState(false);

    // Prevent accidental navigation when form is dirty
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        const isValid = validateMapsConfig();
        setIsMapsEnabled(isValid);
        if (!isValid) {
            setMapError('Google Maps is not properly configured. Location selection will be manual.');
        }

        // Set default date and time on component mount
        const now = new Date();
        setFormData(prev => ({
            ...prev,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5)
        }));
    }, []);

    // Track form changes
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData) || selectedFiles.length > 0;
        setIsDirty(hasChanges);
    }, [formData, selectedFiles]);

    const validateForm = () => {
        const errors = {};
        const { validation } = config.reportForm;

        if (!formData.type) {
            errors.type = 'Crime type is required';
        } else if (!config.reportForm.crimeTypes.includes(formData.type)) {
            errors.type = 'Invalid crime type selected';
        }

        if (!formData.severity) {
            errors.severity = 'Severity level is required';
        } else if (!config.reportForm.severityLevels.map(s => s.value).includes(formData.severity)) {
            errors.severity = 'Invalid severity level selected';
        }

        if (!formData.location) {
            errors.location = 'Location is required';
        }

        if (!formData.description) {
            errors.description = 'Description is required';
        } else if (formData.description.length < validation.descriptionMinLength) {
            errors.description = `Description must be at least ${validation.descriptionMinLength} characters`;
        } else if (formData.description.length > validation.descriptionMaxLength) {
            errors.description = `Description cannot exceed ${validation.descriptionMaxLength} characters`;
        }

        if (!formData.isAnonymous) {
            const { contactInfo } = formData;
            if (!contactInfo.email && !contactInfo.phone) {
                errors.contactInfo = 'Either email or phone is required';
            }
            if (contactInfo.email && !validation.emailRegex.test(contactInfo.email)) {
                errors.email = 'Invalid email format';
            }
            if (contactInfo.phone && !validation.phoneRegex.test(contactInfo.phone)) {
                errors.phone = 'Invalid phone number format';
            }
        }

        if (!formData.date) {
            errors.date = 'Date is required';
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            if (selectedDate > today) {
                errors.date = 'Date cannot be in the future';
            }
        }

        if (!formData.time) {
            errors.time = 'Time is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setError('Please fix the validation errors before submitting.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'contactInfo') {
                    Object.entries(value).forEach(([contactKey, contactValue]) => {
                        if (contactValue) {
                            formDataToSend.append(`contactInfo[${contactKey}]`, contactValue);
                        }
                    });
                } else if (key === 'coordinates' && value.lat && value.lng) {
                    formDataToSend.append('coordinates', JSON.stringify(value));
                } else if (value !== null && value !== '') {
                    formDataToSend.append(key, value);
                }
            });

            // Handle file uploads
            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map(async (file) => {
                    const fileData = new FormData();
                    fileData.append('file', file);

                    try {
                        const uploadResponse = await axios.post(
                            `${config.api.baseUrl}${config.reportForm.endpoints.fileUpload}`,
                            fileData,
                            {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            }
                        );
                        return uploadResponse.data.fileUrl;
                    } catch (error) {
                        console.error('File upload error:', error);
                        throw new Error(`Failed to upload file ${file.name}`);
                    }
                });

                const fileUrls = await Promise.all(uploadPromises);
                formDataToSend.append('attachments', JSON.stringify(fileUrls));
            }

            const response = await axios.post(
                `${config.api.baseUrl}${config.reportForm.endpoints.submit}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                setIsDirty(false);
                navigate('/reports', {
                    state: {
                        success: 'Report submitted successfully!',
                        reportId: response.data.reportId
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred while submitting the report';
            setError(errorMessage);
            console.error('Submit error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onLoadAutocomplete = useCallback((autocomplete) => {
        setAutocomplete(autocomplete);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newLocation = {
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };

                setFormData(prev => ({
                    ...prev,
                    location: newLocation.address,
                    coordinates: { lat: newLocation.lat, lng: newLocation.lng }
                }));
                setMapCenter({ lat: newLocation.lat, lng: newLocation.lng });
            }
        }
    }, [autocomplete]);

    const onMapLoad = useCallback(() => {
        setIsMapLoading(false);
    }, []);

    const onMapError = useCallback((error) => {
        setMapError('Failed to load Google Maps. Please check your internet connection or API key.');
        console.error('Google Maps Error:', error);
        setIsMapLoading(false);
        setIsMapsEnabled(false);
    }, []);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalFiles = selectedFiles.length + files.length;

        if (totalFiles > MAX_FILE_COUNT) {
            setError(`Maximum ${MAX_FILE_COUNT} files allowed`);
            return;
        }

        const invalidFiles = files.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                setError(`File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
                return true;
            }

            const isValidType = ALLOWED_FILE_TYPES.some(type => {
                if (type.endsWith('/*')) {
                    return file.type.startsWith(type.slice(0, -2));
                }
                return file.type === type;
            });

            if (!isValidType) {
                setError(`File ${file.name} has an invalid type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
                return true;
            }

            return false;
        });

        if (invalidFiles.length > 0) {
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);
        setError(null);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setError(null); // Clear any file-related errors when removing files
    };

    const handleCancel = () => {
        if (isDirty) {
            if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
                setIsDirty(false);
                navigate('/reports');
            }
        } else {
            navigate('/reports');
        }
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear validation error for the changed field
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleContactInfoChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                [field]: value
            }
        }));
        // Clear validation error for the changed contact field
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                delete newErrors.contactInfo;
                return newErrors;
            });
        }
    };

    const remainingChars = useMemo(() => {
        const { descriptionMaxLength } = config.reportForm.validation;
        return descriptionMaxLength - (formData.description?.length || 0);
    }, [formData.description]);

    const formatFileSize = (size) => {
        if (size < 1024) {
            return size + ' bytes';
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + ' KB';
        } else if (size < 1024 * 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
            return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            <p className="ml-3 text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Crime Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={(e) => handleFieldChange('type', e.target.value)}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${validationErrors.type ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select a crime type</option>
                            {config.reportForm.crimeTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {validationErrors.type && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.type}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Severity Level *
                        </label>
                        <select
                            name="severity"
                            value={formData.severity}
                            onChange={(e) => handleFieldChange('severity', e.target.value)}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${validationErrors.severity ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select severity level</option>
                            {config.reportForm.severityLevels.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                        {validationErrors.severity && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.severity}</p>
                        )}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                            {!isMapsEnabled && (
                                <span className="text-xs text-yellow-600 ml-2">
                                    (Manual Entry Mode)
                                </span>
                            )}
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            {isMapsEnabled ? (
                                <LoadScript
                                    googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                                    libraries={libraries}
                                >
                                    <Autocomplete
                                        onLoad={onLoadAutocomplete}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <input
                                            type="text"
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.location ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Search for a location"
                                            value={formData.location}
                                            onChange={(e) => handleFieldChange('location', e.target.value)}
                                            required
                                        />
                                    </Autocomplete>

                                    {formData.coordinates.lat && formData.coordinates.lng && (
                                        <div className="mt-4 h-64 rounded-lg overflow-hidden relative">
                                            <GoogleMap
                                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                                center={mapCenter}
                                                zoom={mapsConfig.defaultZoom}
                                                onLoad={onMapLoad}
                                                options={mapsConfig.options}
                                            />
                                            {isMapLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
                                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </LoadScript>
                            ) : (
                                <input
                                    type="text"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.location ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter location manually"
                                    value={formData.location}
                                    onChange={(e) => handleFieldChange('location', e.target.value)}
                                    required
                                />
                            )}
                        </div>
                        {validationErrors.location && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={formData.date}
                                onChange={(e) => handleFieldChange('date', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        {validationErrors.date && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time *
                        </label>
                        <input
                            type="time"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.time ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.time}
                            onChange={(e) => handleFieldChange('time', e.target.value)}
                            required
                        />
                        {validationErrors.time && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.time}</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Description *
                        <span className="text-xs text-gray-500 ml-2">
                            ({config.reportForm.validation.descriptionMinLength}-{config.reportForm.validation.descriptionMaxLength} characters)
                        </span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={4}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${validationErrors.description ? 'border-red-500' : ''
                            }`}
                        placeholder="Please provide a detailed description of the incident..."
                    />
                    {validationErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                    )}
                </div>

                <div className="md:col-span-2 border-t pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="anonymous"
                                name="anonymous"
                                checked={formData.anonymous}
                                onChange={(e) => handleFieldChange('anonymous', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="anonymous" className="ml-2 text-sm text-gray-600">
                                Submit Anonymously
                            </label>
                        </div>
                    </div>

                    {!formData.anonymous && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    placeholder={config.reportForm.defaultValues.phone}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${validationErrors.phone ? 'border-red-500' : ''
                                        }`}
                                />
                                {validationErrors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    placeholder={config.reportForm.defaultValues.email}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${validationErrors.email ? 'border-red-500' : ''
                                        }`}
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Attachments
                        <span className="text-xs text-gray-500 ml-2">
                            (Max {MAX_FILE_COUNT} files, {formatFileSize(MAX_FILE_SIZE)} each)
                        </span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>Upload files</span>
                                    <input
                                        id="file-upload"
                                        name="files"
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        accept={ALLOWED_FILE_TYPES.join(',')}
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                Allowed types: {ALLOWED_FILE_TYPES.join(', ')}
                            </p>
                        </div>
                    </div>
                    {selectedFiles.length > 0 && (
                        <ul className="mt-4 space-y-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="truncate">{file.name}</span>
                                        <span className="ml-2 text-gray-500">({formatFileSize(file.size)})</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {validationErrors.files && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.files}</p>
                    )}
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Report'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportForm; 