import React, { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController
} from "chart.js";
import needyStore from "../store/needy-store";
import donorStore from "../store/donor-store";
import allocationStore from "../store/allocation-store"
import ranks from "../ranks";
import supportedStore from "../store/supported-store";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // ייבוא של BarElement
  BarController
);

const Graphs = () => {
  const [needyData, setNeedyData] = useState([]);
  const [donationData, setDonationData] = useState([]);
  const [supportData, setSupportData] = useState([]);
const[allocationData,setAllocationData]=useState([])
  useEffect(() => {
    needyStore.fetchNeedyList().then(() => {
      const rawData = needyStore.needyList.slice();
      setNeedyData(rawData);
    });
    donorStore.fetchRegDonation().then(() => {
      const rawData = donorStore.regDonationList.slice();
      setDonationData(rawData);
    });
    supportedStore.fetchSupportedList().then(() => {
      const rawData=supportedStore.supportedList.slice();
      setSupportData(rawData);
  });
  allocationStore.fetchAllocationList().then(() => {
    const rawData=allocationStore.allocationList.slice();
    setAllocationData(rawData);
    });
},[]);


  const levelCounts = ranks.map(
    (rank) =>
      needyData.filter((needy) => needy.level_of_need === rank.level).length
  );
  const totalNeedies = needyData.length;
  const dataLevel = {
    labels: ranks.map((rank) => rank.label),
    datasets: [
      {
        data: levelCounts.map((count) =>
          ((count / totalNeedies) * 100).toFixed(2)
        ),
        backgroundColor: [
          ranks[0].color,
          ranks[1].color,
          ranks[2].color,
          ranks[3].color,
          ranks[4].color,
          ranks[5].color,
        ],
      },
    ],
  };

  const donationByYear = donationData.reduce((acc, donation) => {
    const year = new Date(donation.transactionTime).getFullYear();
    acc[year] = (acc[year] || 0) + donation.amount;
    return acc;
  }, {});

  const donationLabels = Object.keys(donationByYear).sort(); // מיון לפי שנה
  const donationValues = donationLabels.map((year) => donationByYear[year]);

  const dataDonation = {
    labels: donationLabels,
    datasets: [
      {
        label: "סכום תרומות לפי שנה",
        labels: donationLabels,
        data: donationValues,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const supportsByCategory = supportData.reduce((acc, support) => {
    const category = support.allocations_id ? allocationData.find(allocation => allocation.id == support.allocations_id).allocation_method || "אחר" : "אחר";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  const supportLabels = Object.keys(supportsByCategory);
  const supportCounts = supportLabels.map(
    (category) => supportsByCategory[category]
  );
  
  const dataSupports = {
    labels: supportLabels,
    datasets: [
      {
        label: "סהכ תמיכות לפי חלוקה",
        // labels:supportLabels,
        data: supportCounts,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ width: "300px", margin: "0 auto", backgroundColor: "#F0EFFF" }}
      >
        <h3>אחוזים מכל דרגת נצרך</h3>
        <Doughnut data={dataLevel} />
      </div>
      <div
        style={{ width: "300px", margin: "0 auto", backgroundColor: "#F0EFFF" }}
      >
        <h3>סכום תרומות לפי שנה</h3>
        <Line data={dataDonation} />
      </div>
      <div
        style={{ width: "300px", margin: "0 auto", backgroundColor: "#F0EFFF" }}
      >
        <h3>תמיכות לפי חלוקה</h3>
        <Bar data={dataSupports} />
      </div>
    </div>
  );
};

export default Graphs;
