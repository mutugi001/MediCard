
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetails } from '@/contexts/DetailsContext';
import { QRCodeCanvas } from "qrcode.react";
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  User, 
  Phone, 
  AlertTriangle, 
  Pill, 
  Shield, 
  Edit, 
  LogOut,
  Stethoscope,
  Calendar,
  UserCheck,
  Activity,
  Zap,
  Star,
  Camera
} from 'lucide-react';

interface HealthData {
  firstname: string;
  lastname: string;
  age: string;
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
  profilePhoto: File;
}

const Dashboard = () => {
 const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const { fetchDetails, Details, loading, error } = useDetails();
  const [healthData, setHealthData] = useState<HealthData>({
    firstname: '',
    lastname: '',
    age: '',
    bloodType: '',
    allergies: '',
    medications: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    doctorName: '',
    doctorPhone: '',
    profilePhoto: '' as unknown as File,
  });

  useEffect(() => {
    if (Details) {
      setHealthData({
        firstname: Details.firstname || '',
        lastname: Details.lastname || '',
        age: Details.age || '',
        bloodType: Details.bloodType || '',
        allergies: Details.allergies || '',
        medications: Details.medications || '',
        emergencyContact: Details.emergencyContact || '',
        emergencyPhone: Details.emergencyPhone || '',
        medicalConditions: Details.medicalConditions || '',
        insuranceProvider: Details.insuranceProvider || '',
        insurancePolicyNumber: Details.insurancePolicyNumber || '',
        doctorName: Details.doctorName || '',
        doctorPhone: Details.doctorPhone || '',
        profilePhoto: Details.profilePhoto || '' as unknown as File,
      });
    }
  }, [Details]);

   useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch health details from context (API)
    fetchDetails();
  }, [isAuthenticated, fetchDetails, navigate]);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const qrURL = import.meta.env.VITE_URL

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Card className="text-center p-8 animate-scale-in shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="h-16 w-16 text-red-500 animate-pulse-slow" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-lg">Set up your health information to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative animate-float">
                <Heart className="h-10 w-10 text-red-500" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MediCard
                </h1>
                <p className="text-sm text-gray-600">Your Digital Health Companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/profile')}
                className="hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300 transition-all duration-300"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="hover:bg-red-50 border-red-200 text-red-700 hover:border-red-300 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Alert Banner */}
        <Card className="mb-8 bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-2xl animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 text-white">
              <div className="relative">
                <AlertTriangle className="h-8 w-8 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Emergency Medical Information</h2>
                <p className="text-red-100">This profile contains critical medical information for emergency responders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1 bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                {healthData.profilePhoto ? (
                  <div className="relative">
                    <img
                      src={healthData.profilePhoto}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <UserCheck className="h-5 w-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                      <User className="h-20 w-20 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {healthData.firstname}{healthData.lastname}
              </CardTitle>
              <CardDescription className="text-lg">Age: {healthData.age}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                <p className="text-sm font-medium text-red-100">Blood Type</p>
                <p className="text-4xl font-bold text-white">{healthData.bloodType}</p>
                <div className="flex justify-center mt-2">
                  <Activity className="h-6 w-6 text-red-200 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-orange-400 to-red-500 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white animate-slide-up">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-100">Emergency Contact</CardTitle>
                <Phone className="h-6 w-6 text-orange-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.emergencyContact}</div>
                <p className="text-xs text-orange-100 mt-1">{healthData.emergencyPhone}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-teal-500 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white animate-slide-up" style={{animationDelay: '0.1s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Primary Doctor</CardTitle>
                <Stethoscope className="h-6 w-6 text-green-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.doctorName || 'Not Set'}</div>
                <p className="text-xs text-green-100 mt-1">{healthData.doctorPhone || 'No phone'}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-400 to-pink-500 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white animate-slide-up" style={{animationDelay: '0.2s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Insurance</CardTitle>
                <Shield className="h-6 w-6 text-purple-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{healthData.insuranceProvider || 'Not Set'}</div>
              </CardContent>
              <CardContent>
                <div className="text-lg font-thin">{healthData.insurancePolicyNumber || 'Not Set'}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white animate-slide-up" style={{animationDelay: '0.3s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Last Updated</CardTitle>
                <Calendar className="h-6 w-6 text-blue-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Today</div>
                <p className="text-xs text-blue-100 mt-1">Profile is current</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
                <span className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Allergies & Reactions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.allergies ? (
                <div className="space-y-3">
                  {healthData.allergies.split('\n').filter(allergy => allergy.trim()).map((allergy, index) => (
                    <Badge 
                      key={index} 
                      variant="destructive" 
                      className="mr-2 mb-2 px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {allergy.trim()}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-lg">No known allergies</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Pill className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Current Medications
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.medications ? (
                <div className="space-y-3">
                  {healthData.medications.split('\n').filter(med => med.trim()).map((medication, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-sm">
                      <p className="text-sm font-medium text-blue-800">{medication.trim()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-lg">No current medications</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-gradient-to-br from-white to-green-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-500" />
                </div>
                <span className="text-2xl bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Medical Conditions & History
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.medicalConditions ? (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200 shadow-sm">
                  <p className="whitespace-pre-wrap text-green-800 font-medium leading-relaxed">{healthData.medicalConditions}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-lg">No medical conditions recorded</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR Code Section */}
         <Card className="mt-8 bg-gradient-to-br from-white to-purple-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Emergency Access QR Code
        </CardTitle>
        <CardDescription className="text-lg">Emergency responders can scan this code to access your medical information</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-40 h-40 mx-auto rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          {user && (
            <QRCodeCanvas
              value={qrURL}
              size={128}
              bgColor="#ffffff"
              fgColor="#4b0082"
              level="H"
              includeMargin={true}
            />
          )}
        </div>
        <p className="text-gray-600 mt-6 text-lg">Share this code with trusted contacts for emergency access</p>
      </CardContent>
    </Card>
      </div>
    </div>
  );
};

export default Dashboard;
