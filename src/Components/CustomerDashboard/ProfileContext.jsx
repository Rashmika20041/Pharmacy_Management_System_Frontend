import { createContext, useState, useContext } from "react";

const ProfileContext = createContext();
export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage")
  );

  const updateProfileImage = (image) => {
    setProfileImage(image);
    localStorage.setItem("profileImage", image);
  };

  return (
    <ProfileContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileContext;