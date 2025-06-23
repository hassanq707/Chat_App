import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    fullname: authUser.fullname,
    bio: authUser.bio,
  });

  const [image, setImage] = useState(authUser.profilePic || null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Case 1: No new image (just fullname/bio update)
    if (!image || typeof image === "string") {
      await updateProfile(profileData);
      navigate('/');
      return;
    }

    // Case 2: New image selected — convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ ...profileData, profilePic: base64Image });
      navigate('/');
    };
  };

  return (
    <div className="min-h-screen bg-[#0b2131] text-white p-4 sm:p-6">
      <div
        className="mb-6 flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <i className="ri-arrow-left-line text-2xl sm:text-3xl text-white/70 hover:text-white leading-none relative top-[1px]"></i>
        <span className="text-white/80 hover:text-white font-medium text-lg sm:text-xl">
          Back
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-[#0d283b] rounded-2xl p-5 sm:p-6 shadow-xl border border-white/10 mt-16 sm:mt-0"
      >
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={
                image
                  ? typeof image === "string"
                    ? image
                    : URL.createObjectURL(image)
                  : "/images/default.png"
              }
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white/10"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <i className="ri-camera-line text-white text-xl sm:text-2xl"></i>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <p className="text-base sm:text-lg font-semibold mt-3">{profileData.fullname}</p>
          <p className="text-white/50 text-xs sm:text-sm text-center max-w-xs mt-1">{profileData.bio}</p>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <input
            type="text"
            name="fullname"
            onChange={handleChange}
            value={profileData.fullname}
            placeholder="Your Name"
            className="w-full bg-[#18445f] px-4 py-2 sm:py-3 rounded-lg outline-none placeholder-white/50 text-sm sm:text-base text-white"
          />

          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            rows={3}
            placeholder="Your Bio"
            className="w-full bg-[#18445f] px-4 py-2 sm:py-3 rounded-lg outline-none placeholder-white/50 text-sm sm:text-base text-white resize-none"
          ></textarea>

          <button
            type="submit"
            className="w-full py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm sm:text-base transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>

  );
};

export default Profile;
