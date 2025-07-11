import { CreditCard, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router'


function LoginPage({ onClick }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false);
            if (onClick) onClick();
        }, 2000);
    };

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-md mx-4">
                {/* Glassmorphism card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-purple-500/25">
                    {/* Header with animated elements */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                                <CreditCard className="w-7 h-7 text-white" />
                                <Sparkles className="w-3 h-3 text-white/80 absolute -top-1 -right-1 animate-ping" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2 animate-pulse">
                            Welcome Back
                        </h1>
                        <p className="text-white/70">Sign in to your BankTech Pro account</p>
                    </div>

                    <div className="space-y-5">
                        <form className="space-y-2">
                            {/* Email field */}
                            <div className="space-y-1">
                                <label className="block text-white/80 text-sm font-medium">Email</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15 backdrop-blur-sm"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="space-y-1">
                                <label className="block text-white/80 text-sm font-medium">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15 backdrop-blur-sm"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Forgot password link */}
                            <div className="text-right">
                                <a href="#" className="text-sm text-purple-300 hover:text-white transition-colors duration-200 hover:underline">
                                    Forgot your password?
                                </a>
                            </div>
                        </form>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Social login buttons */}
                        {/* Divider */}
                        {/* <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-white/60">or continue with</span>
                            </div>
                        </div> */}

                        {/* <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex items-center justify-center px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-sm">Facebook</span>
                            </button>
                        </div> */}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                            Don't have an account?{' '}
                            <a
                                onClick={() => handleNavigation('/register')}
                                className="text-purple-300 hover:text-white transition-colors duration-200 font-medium hover:underline"
                            >
                                Sign up now
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;