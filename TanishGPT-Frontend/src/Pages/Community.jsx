import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAppContext } from "../Context/AppContext";
import moment from "moment";
import { FiDownload } from "react-icons/fi";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { axios } = useAppContext();

  const fetchImages = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/message/published-images");

      // Sirf assistant wali image messages filter karenge
      const publishedImages =
        response.data.publishedImages?.filter(
          (item) =>
            item.isImage &&
            item.isPublished &&
            item.role === "assistant"
        ) || [];

      setImages(publishedImages);
    } catch (error) {
      console.error("Error fetching community images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download Function
  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TanishGPT_Generated_Image.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 pt-12 xl:px-12 2xl:px-20 w-full h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">
        Community Images
      </h2>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={image._id || index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-purple-700 bg-white dark:bg-[#1e1b2e] shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <a
                href={image.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={image.content}
                  alt="community"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300"></div>

              {/* Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300">
                
                {/* Time */}
                <p className="text-white text-sm">
                  {moment(image.timestamp).fromNow()}
                </p>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(image.content)}
                  className="flex items-center gap-1 text-white text-sm hover:text-purple-300 transition"
                >
                  <FiDownload size={18} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center mt-20">
          <p className="text-gray-500 dark:text-purple-200 text-lg">
            No images available.
          </p>
        </div>
      )}
    </div>
  );
};

export default Community;