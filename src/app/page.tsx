"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const QuestionnaireForm: React.FC = () => {
  const [formData, setFormData] = useState({
    destination: "",
    civilizationType: "",
    arrivalDate: "",
    departureDate: "",
    travelPurpose: "",
    willingToTravelFar: false,
    budget: "",
  });

  const router = useRouter();

 const handleChange = (
   e: React.ChangeEvent<
     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
   >
 ) => {
   const target = e.target as HTMLInputElement;
   const { name, value, type } = target;
   const isChecked = type === "checkbox" ? target.checked : undefined;

   setFormData((prevData) => ({
     ...prevData,
     [name]: isChecked ?? value,
   }));
 };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct query parameters
    const queryParams = new URLSearchParams(
      Object.entries(formData).map(([key, value]) => [key, String(value)])
    );

    // Navigate to the new page with query params
    router.push(`/results?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl m-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/logo2.png"
            alt="Airbnb Logo"
            width={250}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Air Assist</h1>
          <p className="text-gray-600 mt-2">Plan your next trip with ease</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 ">
            {/* Destination */}
            <div>
              <label
                htmlFor="destination"
                className="block text-gray-700 font-medium"
              >
                Where do you want to go?
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Civilization Type */}
            <div>
              <label
                htmlFor="civilizationType"
                className="block text-gray-700 font-medium"
              >
                Type of civilization:
              </label>
              <select
                id="civilizationType"
                name="civilizationType"
                value={formData.civilizationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
                <option value="">Select an option</option>
                <option value="rural">Rural</option>
                <option value="urban">Urban</option>
                <option value="suburban">Suburban</option>
              </select>
            </div>

            {/* Arrival Date */}
            <div>
              <label
                htmlFor="arrivalDate"
                className="block text-gray-700 font-medium"
              >
                Day of arrival:
              </label>
              <input
                type="date"
                id="arrivalDate"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Departure Date */}
            <div>
              <label
                htmlFor="departureDate"
                className="block text-gray-700 font-medium"
              >
                Day of leaving:
              </label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Travel Purpose */}
            <div>
              <label
                htmlFor="travelPurpose"
                className="block text-gray-700 font-medium"
              >
                Point of travel:
              </label>
              <textarea
                id="travelPurpose"
                name="travelPurpose"
                value={formData.travelPurpose}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Willing to Travel Far */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="willingToTravelFar"
                name="willingToTravelFar"
                checked={formData.willingToTravelFar}
                onChange={handleChange}
                className="h-5 w-5 text-pink-400 border-gray-300 rounded focus:ring-pink-400"
              />
              <label
                htmlFor="willingToTravelFar"
                className="ml-3 text-gray-700"
              >
                Willing to travel far
              </label>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="block text-gray-700 font-medium"
              >
                What&apos;s the budget?
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-rose-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
