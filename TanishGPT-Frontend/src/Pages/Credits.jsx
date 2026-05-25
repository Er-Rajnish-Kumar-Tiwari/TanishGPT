import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets';
import Loading from './Loading';

// React Icons
import { FaMedal, FaCrown, FaGem, FaCheck } from "react-icons/fa";

const Credits = () => {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Plan Styles
  const getPlanStyle = (planId) => {
    switch (planId) {

      // Bronze - Basic
      case "basic":
        return {
          card: "bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-900 dark:to-amber-700 border-amber-500",
          icon: <FaMedal className='text-amber-700 dark:text-amber-200 text-lg' />,
          badge: "Bronze",
          button: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800",
          price: "text-amber-700 dark:text-amber-200"
        };

      // Silver - Pro
      case "pro":
        return {
          card: "bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-600 border-gray-400",
          icon: <FaGem className='text-gray-700 dark:text-white text-lg' />,
          badge: "Silver",
          button: "bg-gray-700 hover:bg-gray-800 active:bg-gray-900",
          price: "text-gray-800 dark:text-white"
        };

      // Gold - Premium
      case "premium":
        return {
          card: "bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-700 dark:to-yellow-500 border-yellow-500",
          icon: <FaCrown className='text-yellow-700 dark:text-yellow-100 text-lg' />,
          badge: "Gold",
          button: "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800",
          price: "text-yellow-700 dark:text-yellow-100"
        };

      default:
        return {
          card: "bg-white dark:bg-transparent border-gray-200 dark:border-purple-700",
          icon: null,
          badge: "",
          button: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
          price: "text-purple-600 dark:text-purple-300"
        };
    }
  };

  return (

    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>

      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'>
        Credit Plans
      </h2>

      <div className='flex flex-wrap justify-center gap-8'>

        {plans.map((plan) => {

          const style = getPlanStyle(plan._id);

          return (
            <div
              key={plan._id}
              className={`relative border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 min-w-[300px] flex flex-col hover:-translate-y-2 ${style.card}`}
            >

              {/* Badge */}
              <div className='absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/80 dark:bg-black/30 backdrop-blur-md text-gray-800 dark:text-white shadow'>
                {style.icon}
                {style.badge}
              </div>

              <div className='flex-1'>

                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                  {plan.name}
                </h3>

                <p className={`text-3xl font-extrabold mb-5 ${style.price}`}>
                  ${plan.price}
                  <span className='text-base font-normal text-gray-700 dark:text-gray-200'>
                    {" "} / {plan.credits} credits
                  </span>
                </p>

                <ul className='space-y-3'>
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100'
                    >
                      <FaCheck className='text-green-500 text-xs' />
                      {feature}
                    </li>
                  ))}
                </ul>

              </div>

              <button
                className={`mt-8 text-white font-semibold py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:scale-105 ${style.button}`}
              >
                Buy Now
              </button>

            </div>
          );
        })}
      </div>

    </div>

  )
}

export default Credits