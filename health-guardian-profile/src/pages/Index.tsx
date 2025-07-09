
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, Smartphone, CheckCircle } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-blue-600 p-4 rounded-full">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              MediCard
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your digital medical ID for emergency situations. Store critical health information 
              and make it accessible to first responders when every second counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg">
                    <Link to="/dashboard">View Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/profile">Update Profile</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Sign In</Link>
                  </Button>
                   <Button asChild variant="outline" size="lg">
                    <Link to="/FaceScan">Face Scan</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why MediCard?
            </h2>
            <p className="text-xl text-gray-600">
              Designed for emergency situations when you can't speak for yourself
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Emergency Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Critical medical information accessible to first responders and medical professionals
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Family Connected</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Emergency contacts and family members can access your information when needed
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Always Available</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access your health profile anytime, anywhere through your mobile device
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Complete Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Store allergies, medications, emergency contacts, and identification photos
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* What to Include Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Medical Information
            </h2>
            <p className="text-xl text-gray-600">
              Include these critical details in your MediCard profile
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Personal Details", items: ["Full Name", "Age", "Blood Type", "Photo ID"] },
              { title: "Medical History", items: ["Allergies", "Current Medications", "Chronic Conditions", "Past Surgeries"] },
              { title: "Emergency Contacts", items: ["Primary Contact", "Backup Contact", "Primary Doctor", "Insurance Info"] }
            ].map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-center">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your Medical ID?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who have prepared for emergency situations with MediCard
          </p>
          {!isAuthenticated && (
            <Button asChild size="lg">
              <Link to="/register">Create Your Profile Now</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
