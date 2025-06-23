import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [showBio, setShowBio] = useState(false);
  const [agree, setAgree] = useState(false);
  const { login } = useContext(AuthContext);

  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    bio: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleToggle = () => {
    setIsSignup((prev) => !prev);
    setShowBio(false);
    setAgree(false);
    setSignupData({ fullname: "", email: "", password: "", bio: "" });
    setLoginData({ email: "", password: "" });
  };

  const handleData = (e) => {
    const { name, value } = e.target;
    if (isSignup) {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup && !showBio) {
      setShowBio(true);
    } else {
      const credentials = isSignup ? signupData : loginData;
      const state = isSignup ? "signup" : "login";
      login(state, credentials);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0d283b] to-[#0b1721] flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="w-full h-full md:h-auto md:max-w-4xl bg-[#0b2131] border border-[#1a3a52] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden transform transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(42,122,199,0.3)]">
        
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#0d2f47] to-[#103b57] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.8) 0%, transparent 30%)"
          }}></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <img 
              src="/images/logo.png" 
              className="w-28 h-28 mb-3 filter drop-shadow-lg" 
              alt="Logo" 
            />
            <h1 className="text-4xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#5dade2] to-[#aed6f1]">
              Baat Cheet
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-[90%] leading-relaxed">
              Premium messaging experience for VIP users
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 relative bg-[#0b2131]">
          <div className="absolute top-0 right-0 p-4">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#2ecc71] to-[#3498db] animate-pulse"></div>
          </div>
          
          <div className="flex justify-center mb-6 md:hidden">
            <img 
              src="/images/logo.png" 
              className="w-20 h-20 filter drop-shadow-lg" 
              alt="Logo" 
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center md:text-left">
              {isSignup ? (showBio ? "Complete Your Profile" : "Join VIP Club") : "Exclusive Access"}
            </h2>
            <p className="text-[#7f8c8d] mt-1 text-center md:text-left">
              {isSignup ? (showBio ? "Tell us about yourself" : "Create your VIP account") : "Welcome back, VIP member"}
            </p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {isSignup ? (
              showBio ? (
                <>
                  <div className="relative">
                    <textarea
                      name="bio"
                      rows={3}
                      placeholder="Your VIP bio..."
                      value={signupData.bio}
                      onChange={handleData}
                      className="w-full px-4 py-3 rounded-xl bg-[#18445f] border border-[#1a3a52] placeholder-[#7f8c8d] outline-none focus:ring-2 focus:ring-[#3498db] transition-all duration-200 text-white"
                      required
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-[#7f8c8d] text-xs">
                      {signupData.bio.length}/150
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[#3498db] to-[#2ecc71] text-white font-bold text-sm sm:text-base shadow-lg hover:opacity-90 transition-all duration-200"
                  >
                    Complete Registration
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <i className="ri-user-3-line absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]"></i>
                    <input
                      type="text"
                      name="fullname"
                      value={signupData.fullname}
                      onChange={handleData}
                      placeholder="Full Name"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-[#18445f] border border-[#1a3a52] placeholder-[#7f8c8d] outline-none focus:ring-2 focus:ring-[#3498db] transition-all duration-200 text-white"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <i className="ri-mail-line absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]"></i>
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleData}
                      placeholder="VIP Email"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-[#18445f] border border-[#1a3a52] placeholder-[#7f8c8d] outline-none focus:ring-2 focus:ring-[#3498db] transition-all duration-200 text-white"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <i className="ri-lock-2-line absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]"></i>
                    <input
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleData}
                      placeholder="Secure Password"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-[#18445f] border border-[#1a3a52] placeholder-[#7f8c8d] outline-none focus:ring-2 focus:ring-[#3498db] transition-all duration-200 text-white"
                      required
                    />
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agree}
                      onChange={() => setAgree(!agree)}
                      className="mt-1 accent-[#3498db]"
                    />
                    <label htmlFor="terms" className="text-xs sm:text-sm text-[#bdc3c7]">
                      I agree to the <span className="text-[#3498db] cursor-pointer">VIP Terms</span> and <span className="text-[#3498db] cursor-pointer">Privacy Policy</span>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!agree}
                    className={`w-full py-3 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base transition-all duration-200 ${agree
                      ? "bg-gradient-to-r from-[#3498db] to-[#9b59b6] shadow-lg hover:shadow-[0_5px_15px_-5px_rgba(52,152,219,0.6)]"
                      : "bg-[#2c3e50] cursor-not-allowed"
                    }`}
                  >
                    Become VIP Member
                  </button>
                </>
              )
            ) : (
              <>
                <div className="relative">
                  <i className="ri-mail-line absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]"></i>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleData}
                    placeholder="VIP Email"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-[#18445f] border border-[#1a3a52] placeholder-[#7f8c8d] outline-none focus:ring-2 focus:ring-[#3498db] transition-all duration-200 text-white"
                    required
                  />
                </div>
                
                <div className="relative">
                  <i className="ri-lock-2-line absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]"></i>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleData}
                    placeholder="Your Password"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-[#18445f] border border-[#1a3a52] placeholder-[#7f8c8d] outline-none focus:ring-2 focus:ring-[#3498db] transition-all duration-200 text-white"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[#3498db] to-[#2ecc71] text-white font-bold text-sm sm:text-base shadow-lg hover:opacity-90 transition-all duration-200"
                >
                  Unlock VIP Access
                </button>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#7f8c8d]">
              {isSignup ? "Already VIP?" : "Not VIP yet?"}{" "}
              <span
                className="text-[#3498db] mt-1 font-medium cursor-pointer hover:underline"
                onClick={handleToggle}
              >
                {isSignup ? "Sign In" : "Join VIP"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;