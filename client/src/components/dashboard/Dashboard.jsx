// // Dashboard.js
// import React from "react";
// import { motion } from "framer-motion";
// import { Bar } from "react-chartjs-2"; // You need to install react-chartjs-2 and chart.js
// import "chart.js/auto";

// const data = {
//   labels: ["January", "February", "March", "April", "May"],
//   datasets: [
//     {
//       label: "Sales",
//       data: [300, 400, 200, 500, 700],
//       backgroundColor: "#a98467",
//     },
//   ],
// };

// export default function Dashboard() {
//   return (
//     <motion.main
//       className="p-10 bg-PrimaryColor min-h-screen z-10"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">
//         Dashboard Overview
//       </h1>
//       <div className="bg-SecondaryColor p-8 rounded-lg shadow-md">
//         <Bar data={data} />
//       </div>
//     </motion.main>
//   );
// }
import React from 'react'

function Dashboard() {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard