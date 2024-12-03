"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface ApiResponse {
  homeRecommendations?: Array<any>;
  placesToVisit?: Array<any>;
  placesToEat?: Array<any>;
  vaccine?: boolean; // Added vaccine field
  error?: string;
}

const Results: React.FC = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const sendDataToGemini = async (data: Record<string, string | boolean>) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate a JSON response with the following structure:
{
  "homeRecommendations": [
    { "id": 1, "name": "string", "address": "string", "cost": "string", "link": "string", "feature": boolean },
    ...
  ],
  "placesToVisit": [
    { "id": 1, "name": "string", "address": "string", "cost": "string", "link": "string" },
    ...
  ],
  "placesToEat": [
    { "id": 1, "name": "string", "address": "string", "cost": "string", "link": "string" },
    ...
  ],
  "vaccine": boolean

}

Make sure one entry in "homeRecommendations" is a Marriott with "feature": true. Use "unknown" for unavailable data but always try to fill in all data. Finally if the location is somewhere in Africa or South America fill in the vaccine at the bottom of the json as true or false if not. Input data: ${JSON.stringify(
                      data
                    )}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const result = await response.json();
      console.log("Full Response:", result);

      const content =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '{"error": "No response received"}';

      // Remove backticks from the response
      const cleanedContent = content
        .replace(/```json/g, "")
        .replace(/```/g, "");

      // Parse the cleaned JSON response
      try {
        const parsedResponse = JSON.parse(cleanedContent);

        // Normalize the `feature` field to `featured`
        const normalizedData = {
          ...parsedResponse,
          homeRecommendations: parsedResponse.homeRecommendations?.map(
            (home: any) => ({
              ...home,
              featured: home.feature, // Map `feature` to `featured`
            })
          ),
        };

        setApiResponse(normalizedData);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        setApiResponse({ error: "Invalid JSON format from AI response." });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiResponse({ error: "Error fetching response from Gemini AI." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = Object.fromEntries(searchParams.entries());
    sendDataToGemini(data);
  }, [searchParams]);

  // Reusable Card Component
  const Card = ({
    name,
    image,
    address,
    cost,
    link,
    description,
    featured,
  }: any) => {
    console.log({ name, featured }); // Debugging featured property
    const isValidImage = image && image !== "unknown";

    return (
      <div
        className={`relative bg-white shadow-md rounded-lg p-4 mb-4 ${
          featured ? "border-4 border-yellow-500" : ""
        }`}
      >
        {featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        <Image
          src={isValidImage ? image : "/logo2.png"}
          alt={name}
          width={300}
          height={200}
          className="rounded mb-2"
          unoptimized
        />
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600">{description || ""}</p>
        <p className="text-gray-600">
          {address !== "unknown" ? address : "Address not available"}
        </p>
        <p className="text-gray-600">
          {cost !== "unknown" ? cost : "Cost not available"}
        </p>
        {link !== "unknown" && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 inline-block"
          >
            View Details
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 flex items-center justify-center px-4">
      {loading ? (
        // Loading Screen
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto mb-4 animate-bounce"
          />
          <p className="text-white text-lg font-bold">
            Loading your trip plan...
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-5xl m-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Your Recommendations
          </h1>
          {apiResponse?.error ? (
            <p className="text-red-500 text-center">{apiResponse.error}</p>
          ) : (
            <>
              {/* Vaccine Information */}
              {apiResponse?.vaccine && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                  <p>
                    <strong>Note:</strong> Vaccination is recommended for this
                    destination.
                  </p>
                </div>
              )}
              {/* Home Recommendations */}
              <div className="">
                <h2 className="text-3xl underline font-bold text-gray-700 mb-4">
                  Homes to Stay
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiResponse?.homeRecommendations
                    ?.filter((home) => home.featured)
                    .map((home) => (
                      <Card key={home.id} {...home} />
                    ))}

                  {apiResponse?.homeRecommendations
                    ?.filter((home) => !home.featured)
                    .map((home) => (
                      <Card key={home.id} {...home} />
                    ))}
                </div>
              </div>

              {/* Places to Visit */}
              <div className="pt-20">
                <h2 className="text-3xl underline font-bold text-gray-700 mb-4">
                  Places to Visit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiResponse?.placesToVisit?.map((place) => (
                    <Card key={place.id} {...place} />
                  ))}
                </div>
              </div>

              {/* Places to Eat */}
              <div className="pt-20">
                <h2 className="text-3xl underline font-bold text-gray-700 mb-4">
                  Places to Eat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiResponse?.placesToEat?.map((place) => (
                    <Card key={place.id} {...place} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const SuspenseHelper: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  );
};

export default SuspenseHelper;
