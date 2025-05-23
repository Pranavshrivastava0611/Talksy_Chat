import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, Shield, Clock } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Gradient */}
        <div className="text-center mb-8 sm:mb-12 mt-12">
         
          <p className="mt-3 text-base-content/70 text-sm sm:text-base">
            Manage your personal information and account preferences
          </p>
        </div>

        <div className="bg-base-200 rounded-2xl shadow-xl overflow-hidden border border-base-300">
          {/* Profile Banner */}
          <div className="relative h-24 sm:h-32 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
            <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-base-100 shadow-lg transition-all duration-300 group-hover:border-primary"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-1 right-1 sm:bottom-2 sm:right-2
                    bg-primary hover:bg-primary-focus
                    p-2 sm:p-2.5 rounded-full cursor-pointer 
                    shadow-lg transition-all duration-300
                    hover:scale-110 hover:shadow-primary/20
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-primary-content" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 sm:pt-20 p-4 sm:p-8">
            {/* Upload Status */}
            <p className="text-center text-sm text-base-content/70 mb-8">
              {isUpdatingProfile ? (
                <span className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Updating your profile...
                </span>
              ) : (
                "Click the camera icon to update your photo"
              )}
            </p>

            {/* Personal Information */}
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Full Name</span>
                </div>
                <div className="p-3 sm:p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm">
                  {authUser?.FullName}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email Address</span>
                </div>
                <div className="p-3 sm:p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm break-all">
                  {authUser?.email}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-base-100 rounded-xl p-4 sm:p-6 border border-base-300">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-secondary" />
                <h2 className="text-lg font-semibold">Account Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-base-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-base-content/70" />
                    <span className="text-sm text-base-content/70">Member Since</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(authUser.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-base-content/70" />
                    <span className="text-sm text-base-content/70">Account Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    <span className="text-sm font-medium text-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;