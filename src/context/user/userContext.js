import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  // mobile otp state
  const [otp, setOtp] = useState(null);
  // email otp state
  const [otpEmail, setOtpEmail] = useState(null);
  // mobile and email otp verify state
  const [email_or_mobile, setEmail_or_mobile] = useState(null);
  // username state
  const [username, setUsername] = useState("");
  // password user and agent
  const [userAgentPassword, setUserAgentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // user and agent state
  const [userAgentDetails, setUserAgentDetails] = useState("");

  // Role type handle registration time (USER or Agent)
  const [regRoleType, setRegRoleType] = useState("USER");

  // This can be used to store user agent details after fetching from API
  const [profile, setProfile] = useState({});

  // This can be used to share currency or asset details across components
  const [currencyAssetDetails, setCurrencyAssetDetails] = useState({});

  // Authentication form data persistence
  const [authFormData, setAuthFormData] = useState({
    // Email/Phone input data
    email: "",
    phone: "",
    countryDetails: {
      cca2: "GB",
      callingCode: ["44"],
    },
    // Password data
    password: "",
    confirmPassword: "",
    // Username data
    username: "",
    // OTP data
    otp: "",
  });

  // User Agent Details form data persistence
  const [userAgentDetailsFormData, setUserAgentDetailsFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    document: null,
  });

  // Address form data persistence
  const [addressFormData, setAddressFormData] = useState({
    address: "",
    address1: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Function to update specific auth form data
  const updateAuthFormData = (field, value) => {
    setAuthFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to clear all auth form data
  const clearAuthFormData = () => {
    setAuthFormData({
      email: "",
      phone: "",
      countryDetails: {
        cca2: "GB",
        callingCode: ["44"],
      },
      password: "",
      confirmPassword: "",
      username: "",
      otp: "",
    });
  };

  // Function to update specific user agent details form data
  const updateUserAgentDetailsFormData = (field, value) => {
    setUserAgentDetailsFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to clear all user agent details form data
  const clearUserAgentDetailsFormData = () => {
    setUserAgentDetailsFormData({
      firstName: "",
      lastName: "",
      birthday: "",
      gender: "",
      document: null,
    });
  };

  // Function to update specific address form data
  const updateAddressFormData = (field, value) => {
    setAddressFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to clear all address form data
  const clearAddressFormData = () => {
    setAddressFormData({
      address: "",
      address1: "",
      city: "",
      postalCode: "",
      country: "",
    });
  };

  return (
    <UserContext.Provider
      value={{
        otp,
        setOtp,
        otpEmail,
        setOtpEmail,
        email_or_mobile,
        setEmail_or_mobile,
        userAgentDetails,
        setUserAgentDetails,
        username,
        setUsername,
        userAgentPassword,
        setUserAgentPassword,
        confirmPassword,
        setConfirmPassword,
        regRoleType,
        setRegRoleType,
        profile,
        setProfile,
        currencyAssetDetails,
        setCurrencyAssetDetails,
        // Auth form data persistence
        authFormData,
        updateAuthFormData,
        clearAuthFormData,
        // User Agent Details form data persistence
        userAgentDetailsFormData,
        updateUserAgentDetailsFormData,
        clearUserAgentDetailsFormData,
        // Address form data persistence
        addressFormData,
        updateAddressFormData,
        clearAddressFormData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserProvider must be used inside UserProvider");
  }
  return context;
};
