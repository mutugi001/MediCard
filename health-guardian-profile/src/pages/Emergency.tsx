
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import apiClient from '../api/axiosConfig'; // Use the interceptor-enhanced client
import { 
  Heart, 
  Phone, 
  AlertTriangle, 
  Pill, 
  Shield, 
  Stethoscope,
  User,
  Activity,
  Clock,
  MapPin,
  UserCheck
} from 'lucide-react';

interface HealthData {
  firstname: string;
  lastname:string;
  age: string;
  bloodType: string;
  allergies: string;
  medications: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalConditions: string;
  insuranceProvider: string;
  doctorName: string;
  doctorPhone: string;
  profilePhoto: string;
}

const Emergency = () => {
  const { userId } = useParams();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchEmergencyData = async () => {
      if (!userId) return;

      try {
        const response = await apiClient.get(`/api/${userId}/show`);
        setHealthData(response.data);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch emergency data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyData();
  }, [userId]);

  if (!healthData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <Card className="text-center p-8 animate-scale-in shadow-2xl border-0 bg-gradient-to-br from-white to-red-50 max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <AlertTriangle className="h-16 w-16 text-red-500 animate-pulse-slow" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center animate-ping">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Health Data Not Found
            </CardTitle>
            <CardDescription className="text-lg text-red-700">
              No emergency health information available for this patient
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="relative animate-float">
                <AlertTriangle className="h-12 w-12 text-white animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold">EMERGENCY ACCESS</h1>
                <p className="text-red-100 text-lg">Critical Medical Information</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-red-100 mb-2">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-mono">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-red-100">
                <MapPin className="h-5 w-5" />
                <span>Emergency Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Alert Banner */}
        <Card className="mb-8 bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-2xl animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 text-white">
              <div className="relative">
                <Heart className="h-10 w-10 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">PATIENT MEDICAL PROFILE</h2>
                <p className="text-red-100 text-lg">For Emergency Medical Personnel Only</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1 bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                {healthData.profilePhoto ? (
                  <div className="relative">
                    <img
                      src={healthData.profilePhoto}
                      alt={`${healthData.firstname} - Patient Photo`}
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-xl">
                      <User className="h-24 w-24 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-pulse">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <CardTitle className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {healthData.firstname} {healthData.lastname}
              </CardTitle>
              <CardDescription className="text-xl font-semibold text-gray-700">
                Age: {healthData.age} years
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                <p className="text-sm font-medium text-red-100 mb-2">BLOOD TYPE</p>
                <p className="text-6xl font-bold text-white mb-4">{healthData.bloodType}</p>
                <div className="flex justify-center">
                  <Activity className="h-8 w-8 text-red-200 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-orange-400 to-red-500 border-0 shadow-2xl text-white animate-slide-up">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-orange-100">EMERGENCY CONTACT</CardTitle>
                <Phone className="h-8 w-8 text-orange-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{healthData.emergencyContact}</div>
                <div className="text-xl text-orange-100 font-mono">{healthData.emergencyPhone}</div>
                <p className="text-sm text-orange-200 mt-2">Primary Emergency Contact</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-teal-500 border-0 shadow-2xl text-white animate-slide-up" style={{animationDelay: '0.1s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-green-100">PRIMARY PHYSICIAN</CardTitle>
                <Stethoscope className="h-8 w-8 text-green-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{healthData.doctorName || 'Not Available'}</div>
                <div className="text-xl text-green-100 font-mono">{healthData.doctorPhone || 'No phone'}</div>
                <p className="text-sm text-green-200 mt-2">Attending Physician</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-400 to-pink-500 border-0 shadow-2xl text-white animate-slide-up" style={{animationDelay: '0.2s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-purple-100">INSURANCE</CardTitle>
                <Shield className="h-8 w-8 text-purple-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.insuranceProvider || 'Not Available'}</div>
                <p className="text-sm text-purple-200 mt-2">Health Insurance Provider</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 border-0 shadow-2xl text-white animate-slide-up" style={{animationDelay: '0.3s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-100">ACCESS TIME</CardTitle>
                <Clock className="h-8 w-8 text-blue-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentTime.toLocaleDateString()}</div>
                <div className="text-lg text-blue-100 font-mono">{currentTime.toLocaleTimeString()}</div>
                <p className="text-sm text-blue-200 mt-2">Emergency Access Time</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Critical Medical Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-white to-red-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <span className="text-3xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  CRITICAL ALLERGIES
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.allergies ? (
                <div className="space-y-4">
                  {healthData.allergies.split('\n').filter(allergy => allergy.trim()).map((allergy, index) => (
                    <Badge 
                      key={index} 
                      variant="destructive" 
                      className="mr-3 mb-3 px-6 py-3 text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {allergy.trim()}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xl">No known allergies</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Pill className="h-8 w-8 text-blue-500" />
                </div>
                <span className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CURRENT MEDICATIONS
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.medications ? (
                <div className="space-y-4">
                  {healthData.medications.split('\n').filter(med => med.trim()).map((medication, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <p className="text-lg font-semibold text-blue-800">{medication.trim()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xl">No current medications</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Medical Conditions */}
        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
              <span className="text-3xl bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                MEDICAL CONDITIONS & HISTORY
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthData.medicalConditions ? (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-2xl border-2 border-green-200 shadow-lg">
                <p className="whitespace-pre-wrap text-green-800 font-medium leading-relaxed text-lg">{healthData.medicalConditions}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-xl">No medical conditions recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Emergency Instructions */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 border-0 shadow-2xl text-white animate-fade-in" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <AlertTriangle className="h-10 w-10 animate-pulse" />
              EMERGENCY PROTOCOL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
                <Phone className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">1. CONTACT</h3>
                <p className="text-yellow-100">Call emergency contact immediately</p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
                <Stethoscope className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">2. MEDICAL</h3>
                <p className="text-yellow-100">Check allergies before treatment</p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
                <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">3. PRIORITY</h3>
                <p className="text-yellow-100">Blood type and medical conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;