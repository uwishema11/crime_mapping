import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Cookies from 'js-cookie';

import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import useReportsStore from '../../store/reports';
import axios from 'axios';

async function getLocationName(lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  );
  const data = await response.json();
  return extractLocation(data.address);
}
function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

function MapCenterUpdater({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords.lat && coords.lng) {
      map.setView([coords.lat, coords.lng], 13);
    }
  }, [coords, map]);
  return null;
}

function extractLocation(address) {
  const parts = [];
  if (address.suburb) parts.push(address.suburb);
  else if (address.village) parts.push(address.village);
  else if (address.town) parts.push(address.town);
  else if (address.city) parts.push(address.city);
  else if (address.residential) parts.push(address.residential);
  if (address.county) parts.push(address.county);
  return parts.join(', ') || address.display_name;
}

const ReportForm = () => {
  const { formMode, editingReport, closeReportForm } = useReportsStore();
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    crimeName: '',
    categoryName: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    incidentDate: '',
    contactNumber: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        setCategories(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();

    if (formMode === 'edit' && editingReport) {
      setFormData({
        crimeName: editingReport.crimeName || '',
        categoryName: editingReport.categoryName || '',
        description: editingReport.description || '',
        location: editingReport.location || '',
        incidentDate: editingReport.incidentDate
          ? new Date(editingReport.incidentDate).toISOString().split('T')[0]
          : '',
        contactNumber: editingReport.contactNumber || '',
      });
    }
  }, [formMode, editingReport]);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });

          const locationName = await getLocationName(latitude, longitude);
          setFormData((prev) => ({
            ...prev,
            location: locationName,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          }));
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error('Permission denied to access location.');
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error('Location unavailable.');
              break;
            case error.TIMEOUT:
              toast.error('Location request timed out.');
              break;
            default:
              toast.error('Unknown location error.');
          }
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const handleMapSelect = async (latlng) => {
    setCoords(latlng);
    const locationName = await getLocationName(latlng.lat, latlng.lng);
    setFormData((prev) => ({
      ...prev,
      location: locationName,
      latitude: latlng.lat.toString(),
      longitude: latlng.lng.toString(),
    }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    const updated = { ...formData, [name]: value };

    // If both latitude and longitude are present, try to fetch location name
    if (
      (name === 'latitude' || name === 'longitude') &&
      updated.latitude &&
      updated.longitude
    ) {
      try {
        const lat = parseFloat(updated.latitude);
        const lng = parseFloat(updated.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const locationName = await getLocationName(lat, lng);
          updated.location = locationName;
        }
      } catch (err) {
        toast.error('Failed to fetch location name');
      }
    }

    setFormData(updated);
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, categoryName: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.crimeName) errors.crimeName = 'Crime name is required';
    if (!formData.categoryName) errors.categoryName = 'Category is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.incidentDate)
      errors.incidentDate = 'Incident date is required';
    if (!formData.contactNumber)
      errors.contactNumber = 'Contact number is required';
    return errors;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (!submitData.location && submitData.latitude && submitData.longitude) {
        submitData.location = `${submitData.latitude}, ${submitData.longitude}`;
      }

      if (formMode === 'edit') {
        await useReportsStore
          .getState()
          .updateReport(editingReport.id, submitData);
        toast.success('Report updated successfully');
      } else {
        await useReportsStore.getState().createReport(submitData);

        const userCookie = Cookies.get('user');
        let role = 'user';
        if (userCookie) {
          try {
            const user = JSON.parse(userCookie);
            role = user.role || 'user';
          } catch {}
        }

        if (role === 'admin') {
          await useReportsStore.getState().fetchReports({});
        } else {
          await useReportsStore.getState().fetchUserReports({});
        }

        toast.success('Report created successfully');
      }

      closeReportForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">
        {formMode === 'edit' ? 'Edit Report' : 'Create New Report'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="crimeName">Crime Name</Label>
          <Input
            id="crimeName"
            name="crimeName"
            value={formData.crimeName}
            onChange={handleChange}
            placeholder="Enter crime name"
          />
          {formErrors.crimeName && (
            <p className="text-red-500 text-sm">{formErrors.crimeName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryName">Category</Label>
          <div className="relative z-10">
            <Select
              onValueChange={handleCategoryChange}
              value={formData.categoryName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                className="z-50 bg-white border border-gray-300 rounded-md shadow-lg"
              >
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category.name}
                    className="text-gray-900 font-bold"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formErrors.categoryName && (
            <p className="text-red-500 text-sm">{formErrors.categoryName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={4}
          />
          {formErrors.description && (
            <p className="text-red-500 text-sm">{formErrors.description}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location (Name)</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Nyamirambo, Nyarugenge District"
          />
        </div>
        <div className="flex gap-2">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              value={formData.latitude || ''}
              onChange={handleChange}
              placeholder="e.g. -1.95"
              type="number"
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              value={formData.longitude || ''}
              onChange={handleChange}
              placeholder="e.g. 30.06"
              type="number"
              step="any"
            />
          </div>
        </div>
        <div>
          <label>Pick Location on Map</label>
          <MapContainer
            center={[coords.lat || -1.95, coords.lng || 30.06]}
            zoom={coords.lat ? 13 : 8}
            scrollWheelZoom={true}
            style={{ height: '300px', width: '100%' }}
            maxBounds={[
              [-2.85, 28.8], // Southwest
              [-0.95, 30.9], // Northeast
            ]}
            maxBoundsViscosity={1.0}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector onSelect={handleMapSelect} />
            <MapCenterUpdater coords={coords} />
            {coords.lat && coords.lng && (
              <Marker position={[coords.lat, coords.lng]} />
            )}
          </MapContainer>
          <Button type="button" onClick={handleUseMyLocation} className="mt-2">
            Use My Location
          </Button>
          {formErrors.location && (
            <p className="text-red-500 text-sm">{formErrors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentDate">Incident Date</Label>
          <Input
            id="incidentDate"
            name="incidentDate"
            type="date"
            value={formData.incidentDate}
            onChange={handleChange}
          />
          {formErrors.incidentDate && (
            <p className="text-red-500 text-sm">{formErrors.incidentDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact number"
          />
          {formErrors.contactNumber && (
            <p className="text-red-500 text-sm">{formErrors.contactNumber}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closeReportForm}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? 'Saving...'
              : formMode === 'edit'
                ? 'Update Report'
                : 'Create Report'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
