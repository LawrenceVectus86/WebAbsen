import React, { useState } from "react";
import QRCode from "react-qr-code";
import { Html5QrcodeScanner } from "html5-qrcode";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ id_karyawan: "", nama: "" });
  const [absenList, setAbsenList] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [absenType, setAbsenType] = useState(""); // 'datang' or 'pulang'

  // Sample user database
  const users = [
    { id_karyawan: "12345", nama: "John Doe" },
    { id_karyawan: "67890", nama: "Jane Smith" },
  ];

  // Handle login simulation
  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find((u) => u.id_karyawan === user.id_karyawan);
    if (foundUser) {
      setUser(foundUser);
      setIsLoggedIn(true);
    } else {
      alert("User not found!");
    }
  };

  // Handle QR code scan
  const handleQRScan = () => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render((decodedText, decodedResult) => {
      const foundUser = users.find((u) => u.id_karyawan === decodedText);
      if (foundUser) {
        handleAbsen(foundUser);
        scanner.clear();
        setShowQRScanner(false);
      } else {
        alert("QR Code tidak valid!");
      }
    });
  };

  // Handle attendance registration
  const handleAbsen = (user) => {
    const currentTime = new Date().toLocaleString();
    const newAbsen = {
      id_karyawan: user.id_karyawan,
      nama: user.nama,
      waktu: currentTime,
      jenis_absen: absenType,
    };
    setAbsenList([...absenList, newAbsen]);
    setAbsenType(""); // Reset absen type
  };

  // Export attendance data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(absenList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data_absen.xlsx");
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-center text-2xl font-bold mb-6">
        Absensi Karyawan dengan QR Code
      </h2>

      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700">ID Karyawan</label>
            <input
              type="text"
              className="mt-2 p-2 w-full border border-gray-300 rounded"
              value={user.id_karyawan}
              onChange={(e) => setUser({ ...user, id_karyawan: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Selamat Datang, {user.nama}</h3>

          <div className="flex justify-center mb-6">
            <QRCode value={user.id_karyawan} size={128} />
          </div>

          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setAbsenType("datang");
                setShowQRScanner(true);
                handleQRScan();
              }}
            >
              Absen Datang
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setAbsenType("pulang");
                setShowQRScanner(true);
                handleQRScan();
              }}
            >
              Absen Pulang
            </button>
          </div>

          {showQRScanner && (
            <div className="mt-6">
              <div id="reader" style={{ width: "300px" }}></div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Download Data Absensi
        </button>

        <h3 className="text-lg font-semibold mb-4">Daftar Absensi</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID Karyawan</th>
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">Waktu</th>
              <th className="border px-4 py-2">Jenis Absen</th>
            </tr>
          </thead>
          <tbody>
            {absenList.map((absen, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{absen.id_karyawan}</td>
                <td className="border px-4 py-2">{absen.nama}</td>
                <td className="border px-4 py-2">{absen.waktu}</td>
                <td className="border px-4 py-2">{absen.jenis_absen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
