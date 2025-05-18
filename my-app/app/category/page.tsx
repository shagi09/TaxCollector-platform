'use client'
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Building2, FileBarChart2 } from "lucide-react";

export default function TaxSelector() {
  const router = useRouter();

  const selectDashboard = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-400  flex items-center justify-center p-6 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white text-gray-900 rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center space-y-6"
      >
        <h1 className="text-3xl font-extrabold tracking-tight">Choose Your Tax Type</h1>
        <p className="text-gray-600">Select a tax category.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center"
            onClick={() => selectDashboard()}
          >
            <Building2 className="w-10 h-10 mb-2" />
            <div className="text-lg font-semibold">Corporate Tax</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center"
            onClick={() => selectDashboard()}
          >
            <FileBarChart2 className="w-10 h-10 mb-2" />
            <div className="text-lg font-semibold">VAT</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
