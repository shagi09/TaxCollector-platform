"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import qrcode from "qrcode";
import TanaFotter from '../../components/';
import axios from "axios";
import {
  FaRegWindowClose,
  FaDownload,
  FaArrowLeft,
  FaQrcode,
  FaShareAlt,
  FaMapMarkerAlt,
  FaSun,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { Tooltip } from "react-tooltip";

const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const BookingDetailsPage = () => {
  const { t } = useTranslation();
  const { _id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (_id) {
      const fetchBookingDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/booking/${_id}`);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
          alert(t("ErrorFetchingBooking"));
        }
      };
      fetchBookingDetails();
    }
  }, [_id]);

  useEffect(() => {
    if (_id) {
      qrcode.toDataURL(_id, { width: 300, margin: 2 }, (err, url) => {
        if (err) {
          console.error("Error generating QR code:", err);
        } else {
          setQrUrl(url);
        }
      });
    }
  }, [_id]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const mockWeather = {
          temp: "25°C",
          condition: "Sunny",
          icon: "sun",
        };
        setWeather(mockWeather);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
    if (data?.bookingDetails?.destinationLocation) {
      fetchWeather();
    }
  }, [data]);

  const downloadCard = async () => {
    if (qrUrl) {
      const link = document.createElement("a");
      link.download = "booking-qrcode.png";
      link.href = qrUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved === 'true';
    setDarkMode(isDark);
  }, []);

  const shareBooking = async () => {
    try {
      await navigator.share({
        title: t("BookingInformation"),
        text: `Check out my booking details for ${data?.bookingDetails?.destinationLocation}!`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing booking:", error);
      alert(t("ErrorSharing"));
    }
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 ">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20"
        >
          <div className="absolute w-full h-full border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full"></div>
          <FaMapMarkerAlt className="absolute inset-0 m-auto text-gray-500 text-3xl" />
        </motion.div>
      </div>
    );
  }

  const destinationDescription = `Embark on an unforgettable journey to ${data.bookingDetails.destinationLocation}. Discover pristine beaches, vibrant coral reefs, and local culture that promises adventure and relaxation.`;

  const itinerary = [
    { day: "Day 1", activity: "Arrival and welcome aboard" },
    { day: "Day 2", activity: "Snorkeling and beach exploration" },
    { day: "Day 3", activity: "Sunset cruise and local dining" },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-black" : "bg-white"}`}>
      <div className="absolute inset-0 bg-[url('/waves-pattern.svg')] bg-repeat animate-pulse opacity-10"></div>

      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-10 bg-gray-900/40 mx-10 p-4 rounded-2xl shadow-xl backdrop-blur-md sticky top-4 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/")}
          className="bg-white text-gray-500 p-3 rounded-full hover:bg-blue-100 transition-all duration-300"
          data-tooltip-id="back-tooltip"
        >
          <FaArrowLeft size={22} />
        </motion.button>
        <Tooltip id="back-tooltip" content={t("BackToHome")} />

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCard}
            className="flex items-center bg-white text-gray-500 py-2 px-6 rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300"
            data-tooltip-id="download-tooltip"
          >
            <FaDownload className="mr-2" />
            <span className="font-semibold">{t("Download")}</span>
          </motion.button>
          <Tooltip id="download-tooltip" content={t("DownloadQRCode")} />

          {qrUrl && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-gray-500 p-3 rounded-full hover:bg-blue-100 transition-all duration-300"
              data-tooltip-id="qr-tooltip"
            >
              <FaQrcode size={22} />
            </motion.button>
          )}
          <Tooltip id="qr-tooltip" content={t("ViewQRCode")} />

          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={shareBooking}
            className="bg-white text-gray-500 p-3 rounded-full hover:bg-blue-100 transition-all duration-300"
            data-tooltip-id="share-tooltip"
          >
            <FaShareAlt size={22} />
          </motion.button>
          <Tooltip id="share-tooltip" content={t("ShareBooking")} />
        </div>
      </motion.nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="border border-blue-500/40 bg-gradient-to-br from-white/25 to-white/10 text-gray-500 font-semibold text-sm shadow-black/10 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-500"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-500 mb-6 text-center border-b-4 border-blue-500 pb-3"
          >
            {t("BookingInformation")}
          </motion.h2>

          <motion.div className="flex justify-center mb-6">
            <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md animate-pulse">
              {t("Confirmed")}
            </span>
          </motion.div>

          {qrUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mb-6"
            >
              <img
                src={qrUrl}
                alt={t("QRCodePreview")}
                className="w-32 h-32 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </motion.div>
          )}

          <div className="space-y-4 text-gray-700 font-medium">
            {[
              { label: t("FirstName"), value: data.bookingDetails.firstName },
              { label: t("LastName"), value: data.bookingDetails.lastName },
              { label: t("Phone"), value: data.bookingDetails.phone },
              { label: t("Destination"), value: data.bookingDetails.destinationLocation },
              { label: t("Departure"), value: data.bookingDetails.departureLocation },
              { label: t("Passengers"), value: data.bookingDetails.numberOfPassengers },
              { label: t("BoatOwner"), value: data.boatOwnerDetails.name },
              { label: t("FathersName"), value: data.boatOwnerDetails.fatherName },
              { label: t("PromoCode"), value: data.promocodeDetails.code },
            ].map((item, index) => (
              <motion.p
                key={item.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 5, color: "#2dd4bf" }}
                className="transition-colors duration-200 text-sm"
              >
                <span className="font-semibold text-gray-500">{item.label}:</span> {item.value}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <div className="md:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="border border-blue-500/40 bg-gradient-to-br from-white/25 to-white/10 text-gray-500 font-semibold text-sm shadow-black/10 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-500"
          >
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-semibold text-gray-500 mb-6 border-b-4 border-blue-500 pb-3"
            >
              {t("AboutYourTrip")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-700 leading-relaxed mb-6"
            >
              {destinationDescription}
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 font-medium">
              {[
                { label: t("CheckInTime"), value: data.bookingDetails.checkInTime || "10:00 AM" },
                { label: t("CheckOutTime"), value: data.bookingDetails.checkOutTime || "6:00 PM" },
                { label: t("BookingDate"), value: data.bookingDetails.bookingDate || new Date().toLocaleDateString() },
                { label: t("BoatType"), value: data.bookingDetails.boatType || "Yacht" },
                { label: t("TotalCost"), value: data.bookingDetails.totalCost ? `$${data.bookingDetails.totalCost}` : "$500" },
              ].map((item, index) => (
                <motion.p
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5, color: "#2dd4bf" }}
                  className="transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-500">{item.label}:</span> {item.value}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="border border-blue-500/40 bg-gradient-to-br from-white/25 to-white/10 text-gray-500 font-semibold text-sm shadow-black/10 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-500"
          >
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-semibold text-gray-500 mb-6 border-b-4 border-blue-500 pb-3"
            >
              {t("Itinerary")}
            </motion.h2>
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                >
                  <span className="text-gray-500 font-bold">{item.day}</span>
                  <p className="text-gray-700">{item.activity}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {weather && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="border border-blue-500/40 bg-gradient-to-br from-white/25 to-white/10 text-gray-500 font-semibold text-sm shadow-black/10 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-500"
            >
              <motion.h2
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-semibold text-gray-500 mb-6 border-b-4 border-blue-500 pb-3"
              >
                {t("WeatherForecast")}
              </motion.h2>
              <div className="flex items-center space-x-4">
                <FaSun className="text-yellow-500 text-4xl" />
                <div>
                  <p className="text-gray-700 font-semibold">{weather.temp}</p>
                  <p className="text-gray-600">{weather.condition}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <TanaFotter />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="backdrop-blur-md border border-blue-500/40 bg-gradient-to-br from-white/25 to-white/10 text-blue-600 font-semibold text-sm shadow-md shadow-black/10 p-10 rounded-3xl relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all duration-300"
              >
                <FaRegWindowClose size={26} />
              </motion.button>
              <img
                src={qrUrl}
                alt={t("QRCode")}
                className="w-80 h-80 mx-auto rounded-lg shadow-md"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingDetailsPage;