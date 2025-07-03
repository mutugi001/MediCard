import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, User, Heart } from 'lucide-react';
import { useDetails } from '@/contexts/DetailsContext';

interface HealthData {
  firstname: string;
  lastname: string;
  phoneNumber: '',
  gender: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  medications: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalConditions: string;
  insuranceProvider: string;
  insurancePolicyNumber: string
  doctorName: string;
  doctorPhone: string;
  profilePhoto: string | File | null;
}
const initialHealthDataState: HealthData = {
  firstname: "",
  lastname: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  bloodType: "",
  allergies: "",
  medications: "",
  emergencyContact: "",
  emergencyPhone: "",
  medicalConditions: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  doctorName: "",
  doctorPhone: "",
  profilePhoto: null,
};


const HealthProfile = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { Details, loading: detailsLoading, fetchDetails, addDetails } = useDetails();

  const [healthData, setHealthData] = useState<HealthData>(initialHealthDataState);

  // Load saved draft
  useEffect(() => {
    const cached = localStorage.getItem("unsavedHealthData");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setHealthData(prev => ({ ...prev, ...parsed,  }));
      } catch (e) {
        console.error("Invalid cached form data");
      }
    }
  }, []);

  // Fetch details on mount
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);


  // Prefill form when details arrive
useEffect(() => {
  if (Details?.profilePhoto && !detailsLoading) {
    setHealthData(prev => ({
      ...prev,
      profilePhoto: prev.profilePhoto ?? Details.profilePhoto,
    }));
  }
}, [Details, detailsLoading]);


  const handleChange = (field: keyof HealthData, value: string) => {
    const updated = { ...healthData, [field]: value };
    setHealthData(updated);
    localStorage.setItem(
      "unsavedHealthData",
      JSON.stringify({ ...updated, profilePhoto: typeof healthData.profilePhoto === "string" ? healthData.profilePhoto : null })
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHealthData(prev => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  const getPreviewUrl = (): string | null => {
    const photo = healthData.profilePhoto;
    if (!photo) return null;
    if (typeof photo === "string") return photo;
    return URL.createObjectURL(photo); // File object
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(healthData).forEach(([key, value]) => {
        if (key === "profilePhoto" && value instanceof File) {
          formData.append("profilePhoto", value);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      const success = await addDetails(formData);

      if (success) {
        localStorage.removeItem("unsavedHealthData");
        toast({
          title: "Profile Updated!",
          description: "Your health profile was saved successfully.",
        });
        navigate("/profile");
      } else {
        toast({
          title: "Failed",
          description: "There was an error saving your profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "An error occurred during submission.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Health Profile</h1>
          <p className="text-gray-600 mt-2">Complete your medical information for emergency situations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Photo
              </CardTitle>
              <CardDescription>
                Upload a clear photo for identification purposes
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* {console.log(healthData.profilePhoto)} */}
              <div className="flex items-center space-x-4">
                {healthData.profilePhoto ? (
                  <img
                    src={healthData.profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div>
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </div>
                  </Label>

                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  value={healthData.firstname}
                  onChange={(e) => handleChange('firstname', e.target.value)}
                  required
                />
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  value={healthData.lastname}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  required
                />
                <Label htmlFor="phoneNumber">PhoneNumber</Label>
                <Input
                  id="phoneNumber"
                  value={healthData.phoneNumber}
                  type="tel"
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">DOB</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={healthData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  required
                />
                <Label htmlFor="gender">Sex</Label>
                <select
                  id="gender"
                  value={healthData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
                  id="bloodType"
                  value={healthData.bloodType}
                  onChange={(e) => handleChange('bloodType', e.target.value)}
                  placeholder="e.g., A+, O-, B+"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={healthData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  placeholder="List any known allergies (medications, foods, environmental)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={healthData.medications}
                  onChange={(e) => handleChange('medications', e.target.value)}
                  placeholder="List current medications and dosages"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={healthData.medicalConditions}
                  onChange={(e) => handleChange('medicalConditions', e.target.value)}
                  placeholder="List any chronic conditions or medical history"
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={healthData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={healthData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Provider */}
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Provider</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Primary Doctor</Label>
                <Input
                  id="doctorName"
                  value={healthData.doctorName}
                  onChange={(e) => handleChange('doctorName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorPhone">Doctor's Phone</Label>
                <Input
                  id="doctorPhone"
                  type="tel"
                  value={healthData.doctorPhone}
                  onChange={(e) => handleChange('doctorPhone', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={healthData.insuranceProvider}
                  onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                />
                <Label htmlFor="insuranceProvider">Insurance Policy number</Label>
                <Input
                  id="insurancePolicyNumber"
                  value={healthData.insurancePolicyNumber}
                  onChange={(e) => handleChange('insurancePolicyNumber', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            {/* Save Profile (Create) Button */}
            {!Details && (
              <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
              >
              {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            )}

            {/* Update Profile Button */}
            {Details && (
              <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
              >
              {isLoading ? "updating..." : "Update Profile"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthProfile;
