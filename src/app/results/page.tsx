"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface ApiResponse {
  homeRecommendations?: Array<any>;
  placesToVisit?: Array<any>;
  placesToEat?: Array<any>;
  error?: string; // Add the optional `error` property
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
    { "id": 1, "name": "string", "address": "string", "cost": "string", "link": "string" },
    ...
  ],
  "placesToVisit": [
    { "id": 1, "name": "string", "address": "string", "cost": "string", "link": "string" },
    ...
  ],
  "placesToEat": [
    { "id": 1, "name": "string" "address": "string", "cost": "string", "link": "string" },
    ...
  ]
}

Respond with "unknown" for unavailable data. Input data: ${JSON.stringify(
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
        setApiResponse(parsedResponse);
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
  const Card = ({ name, image, address, cost, link, description }: any) => {
    // Check if the image is valid
    const isValidImage = image && image !== "unknown";

    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <Image
          src={"/logo2.png"}
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
              {/* Home Recommendations */}
              <div className="">
                <h2 className="text-3xl underline font-bold text-gray-700 mb-4">
                  Homes to Stay
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiResponse?.homeRecommendations?.map((home) => (
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
