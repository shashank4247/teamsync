import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLayout, FiCheckCircle, FiZap, FiUsers } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to boards
  React.useEffect(() => {
    if (user) {
      navigate('/boards');
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-fadeIn relative overflow-hidden">

      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-2xl mb-8 inline-block shadow-lg animate-bounce-slow">
        <FiLayout className="text-5xl text-blue-600" />
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
        Manage projects <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 animate-shimmer bg-[length:200%_auto]">
          without the chaos.
        </span>
      </h1>

      <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 leading-relaxed font-medium">
        TeamSync is the modern project management tool that helps your team stay aligned, focused, and efficient. Real-time updates, powerful automation, and a beautiful interface.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        {user ? (
          <Link
            to="/boards"
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:scale-105"
          >
            Go to Workspace
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <span className="relative z-10">Get Started for Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Log In
            </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full text-left">
        <FeatureCard
          icon={<FiZap />}
          title="Real-time Sync"
          desc="See changes instantly as your team works. No refresh needed."
          gradient="from-blue-50 to-indigo-50"
          iconColor="text-blue-600"
        />
        <FeatureCard
          icon={<FiCheckCircle />}
          title="Workflow Automation"
          desc="Automate repetitive tasks with powerful rules and triggers."
          gradient="from-emerald-50 to-teal-50"
          iconColor="text-emerald-600"
        />
        <FeatureCard
          icon={<FiUsers />}
          title="Team Collaboration"
          desc="Assign tasks, comment, and track progress together seamlessly."
          gradient="from-amber-50 to-orange-50"
          iconColor="text-amber-600"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient, iconColor }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}>
      <div className={`bg-white w-14 h-14 rounded-xl flex items-center justify-center ${iconColor} text-2xl mb-5 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
