import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import axios from "axios";
import "./Button.css";

import printicon from "../Images/printer.png";
const PrintPdf = () => {
  const chartRef = useRef(null);
  const [generatePdf, setGeneratePDF] = useState(false);
  const [myChart, setMyChart] = useState(null);
  const [data, setData] = useState({ date_years: [], Burglary: [] });

  const generatePDF = () => {
    if (myChart) {
      setTimeout(() => {
        const canvas = chartRef.current;
        const aspectRatio = canvas.height / canvas.width;
        const pdfWidth = 210;
        const pdfHeight = pdfWidth * aspectRatio;

        const pdf = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: [pdfWidth, pdfHeight],
        });
        const chartWidth = pdfWidth - 20;
        const chartHeight = chartWidth * aspectRatio;

        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 10, chartWidth, chartHeight);
        console.log("saved pdf");
        pdf.save("chart.pdf");
      }, 100);
    }
  };

  const getData = async (url) => {
    try {
      const res = await axios.get(url);
      const dataArr = res.data?.data || [];
      const datesArr = dataArr.map((ele) => ele.data_year || 0);
      const burglaryArr = dataArr.map((ele) => ele.Burglary || 0);
      setData({ date_years: datesArr, Burglary: burglaryArr });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData(
      `https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv`
    );
  }, []);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (myChart) {
      myChart.destroy();
    }

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.date_years,
        datasets: [
          {
            label: "Burglary",
            data: data.Burglary,
            borderColor: "#1463FF",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          scales: {
            x: { display: true },
            y: { display: true },
          },
          zoom: {
            drag: false,
            wheel: false,
          },
        },
      },
    });

    setMyChart(newChart);
    generatePDF();
    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} id="myChart" width="400" height="400"></canvas>
    </div>
  );
};

export default PrintPdf;
