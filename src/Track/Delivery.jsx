import { useEffect, useState } from "react";
import { db } from "../Config/Config";
import { doc, getDoc } from "firebase/firestore";

const Delivery = ({ selectedCode }) => {
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCode) {
      fetchDeliveryData();
    }
  }, [selectedCode]);

  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, selectedCode, "Delivery"); // 'selectedCode' is the collection name
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const deliveries = docSnap.data().deliveries || [];

        if (deliveries.length > 0) {
          const firstDelivery = deliveries[0]; // Get only the first object

          // Extract only the required fields
          const {
            deliveryAddress,
            deliveryTime,
            expectedDate,
            id,
            pickupAddress,
            receiver,
            shipper,
            signatureRequired,
            trackingNumber,
          } = firstDelivery;

          setDeliveryData({
            deliveryAddress,
            deliveryTime,
            expectedDate,
            id,
            pickupAddress,
            receiver,
            shipper,
            signatureRequired,
            trackingNumber,
          });
        } else {
          setDeliveryData(null);
        }
      } else {
        setDeliveryData(null);
      }
    } catch (error) {
      console.error("Error fetching delivery data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg border border-gray-300 text-black h-[460px] overflow-y-auto">
    <h2 className="text-lg font-semibold mb-2 bg-[#091242] text-white p-2 rounded-t-lg">
      INFORMATION
    </h2>
  
    {loading ? (
      <p className="text-center text-gray-500">Loading...</p>
    ) : deliveryData ? (
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-100">
          <tbody>
            {Object.entries(deliveryData).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-500">
                <th className="px-2 py-1 text-left text-sm font-medium">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </th>
                <td className="px-2 py-1 text-sm">
                  {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-center text-gray-500">No delivery details available.</p>
    )}
  </div>
  );
};

export default Delivery;
