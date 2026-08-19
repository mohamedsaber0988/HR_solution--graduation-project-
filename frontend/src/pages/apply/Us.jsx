import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Globe,
  PanelsTopLeft,
  Shield,
  TriangleAlert,
  Zap,
  GitPullRequest,
  FileText,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-orange-500" />,
    title: "Fast Setup",
    desc: "Get started quickly with a clean and simple onboarding experience.",
    bg: "bg-orange-50",
  },
  {
    icon: <PanelsTopLeft className="w-6 h-6 text-blue-500" />,
    title: "All-in-One HR",
    desc: "Manage employees, attendance, and payroll from one place.",
    bg: "bg-blue-50",
  },
  {
    icon: <GitPullRequest className="w-6 h-6 text-green-500" />,
    title: "Approval Workflows",
    desc: "Easy approvals for leave requests and HR operations.",
    bg: "bg-green-50",
  },
  {
    icon: <FileText className="w-6 h-6 text-purple-500" />,
    title: "Payroll Ready",
    desc: "Generate accurate reports ready for payroll processing.",
    bg: "bg-purple-50",
  },
  {
    icon: <Shield className="w-6 h-6 text-red-500" />,
    title: "Secure System",
    desc: "Role-based access and secure employee data management.",
    bg: "bg-red-50",
  },
  {
    icon: <Globe className="w-6 h-6 text-indigo-500" />,
    title: "Arabic & English",
    desc: "Built for local teams with bilingual support.",
    bg: "bg-indigo-50",
  },
];

const compareRows = [
  ["Attendance Tracking", "Limited", true],
  ["Leave Requests", "Included", true],
  ["Payroll Reports", "Limited", true],
  ["Mobile Access", "Not Included", true],
  ["Arabic Support", "Not Included", true],
];

const plans = [
  {
    name: "Starter",
    price: "EGP0",
    desc: "Best for small teams",
    features: [
      "Employee management",
      "Attendance tracking",
      "Leave management",
      "Basic reports",
    ],
    button: "Get Started",
    featured: false,
  },
  {
    name: "Business",
    price: "EGP0",
    desc: "Best for growing companies",
    features: [
      "Everything in Starter",
      "Approval workflows",
      "Advanced reports",
      "Priority support",
    ],
    button: "Request Demo",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Best for enterprises",
    features: [
      "Custom workflows",
      "Integrations",
      "Dedicated support",
      "SLA onboarding",
    ],
    button: "Contact Sales",
    featured: false,
  },
];

const Page = () => {
  const navigate = useNavigate();
  return (
    <div className="font-sans antialiased text-slate-900 bg-white">

      {}
      <section
        id="home"
        className="pt-24 pb-28 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-6xl mx-auto px-5 text-center">

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            Next-Gen HR Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
          >
            Manage your team <br />
            <span className="text-gradient">without the chaos.</span>
          </motion.h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed mb-10">
            Attendance, payroll, approvals, and employee management
            in one simple platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="pro-btn-primary flex items-center justify-center gap-2 px-8 py-4"
            >
              Start Free Trial
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="pro-btn-secondary px-8 py-4"
            >
              Book a Demo
            </motion.button>

          </div>
        </div>
      </section>

      {}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Why teams choose Managly
            </h2>

            <p className="text-slate-500 text-lg">
              Everything HR needs in one clean system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="pro-card-interactive p-7"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.bg}`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5">

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              How Managly compares
            </h2>

            <p className="text-slate-500 text-lg">
              Built for real HR operations.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-5 text-sm text-slate-500">
                    Feature
                  </th>

                  <th className="text-left px-6 py-5 text-sm text-slate-500">
                    Others
                  </th>

                  <th className="text-left px-6 py-5 text-sm text-blue-600">
                    Managly
                  </th>
                </tr>
              </thead>

              <tbody>
                {compareRows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100"
                  >
                    <td className="px-6 py-5 font-medium">
                      {row[0]}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500">

                        {row[1] === "Not Included" ? (
                          <X className="w-4 h-4 text-red-500" />
                        ) : (
                          <TriangleAlert className="w-4 h-4 text-orange-500" />
                        )}

                        {row[1]}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <Check className="w-4 h-4" />
                        Included
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </section>

      {}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple pricing
            </h2>

            <p className="text-slate-500 text-lg">
              Choose the right plan for your company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-3xl p-8 border transition ${
                  plan.featured
                    ? "border-blue-600 shadow-xl"
                    : "border-slate-200"
                }`}
              >

                {plan.featured && (
                  <div className="inline-block mb-5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                    Recommended
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">
                  {plan.name}
                </h3>

                <p className="text-slate-500 mb-6">
                  {plan.desc}
                </p>

                <div className="mb-8">
                  <span className="text-5xl font-extrabold">
                    {plan.price}
                  </span>

                  {plan.price !== "Custom" && (
                    <span className="text-slate-500 ml-2">
                      /month
                    </span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">

                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3"
                    >
                      <Check className="w-5 h-5 text-green-500" />

                      <span className="text-slate-600">
                        {feature}
                      </span>
                    </li>
                  ))}

                </ul>

                <button
                  onClick={() => navigate('/Portal/Payment')}
                  className={`w-full py-4 rounded-xl font-semibold transition ${
                    plan.featured
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {plan.button}
                </button>

              </div>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
};

export default Page;