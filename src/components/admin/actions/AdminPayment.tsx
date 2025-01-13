import React, { useEffect, useState } from "react";
import SideBar from "../layout/SideBar";
import useAuthCheck from "../../../useAuthCheck";
import { deletePayment, getAllPayment } from "../../../service/PaymentService";
import { CheckoutFormProps } from "../../../interfaces/CheckoutFormProps";

const AdminPayment: React.FC = () => {

    useAuthCheck(["Admin"]);
    const [payments, setPayments] = useState<CheckoutFormProps[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<CheckoutFormProps[] >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAllPayment();
        setPayments(data);
        setFilteredReservations(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch reservation data. Please try again later.");
        setLoading(false);
        console.error(error);
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const confirmResponse = window.confirm(
        "Are you sure you want to delete this record?"
      );
      if (confirmResponse) {
        await deletePayment(id);
        setPayments((prev) =>
          prev.filter((res) => res.reservationId !== id)
        );
        setFilteredReservations((prev) =>
          prev.filter((res) => res.reservationId !== id)
        );
      }
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  const handleDateFilter = () => {
    let filtered = [...payments];

    if (fromDate) {
      filtered = filtered.filter((res) => {
        const resDate = new Date(res.paymentDate);
        return resDate >= new Date(fromDate);
      });
    }

    if (toDate) {
      filtered = filtered.filter((res) => {
        const resDate = new Date(res.paymentDate);
        return resDate <= new Date(toDate);
      });
    }

    setFilteredReservations(filtered);
  };

  const totalTickets = filteredReservations.reduce(
    (total, res) => total + res.numOfTickets,
    0
  );
  const totalIncome = filteredReservations.reduce(
    (total, res) => total + res.amount,
    0
  );


  return (
    <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      <SideBar />

      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 my-1">
            <span className="text-muted fw-light">User /</span> All
            Payments
          </h4>
          <div>
            {error && (
              <div className="alert alert-warning d-flex justify-content-between">
                {error}{" "}
                <i className="fa-solid fa-circle-exclamation pt-1"></i>
              </div>
            )}
            {loading && <p>Loading...</p>}
            {!loading && !error && (
              <>
                {/* Date Filters */}
                <div className="filters mb-3 d-flex justify-content-between">
                  <div className="d-flex">
                    <div>
                      <label htmlFor="fromDate" className="form-label">
                        From:
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <div className="mx-2">
                      <label htmlFor="toDate" className="form-label">
                        To:
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>

                    <div className="ms-3" style={{ marginTop: "30px" }}>
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleDateFilter}
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: "30px" }}>
                    <div className="btn btn-outline-dark mx-2 disabled">
                      Total Tickets: {totalTickets}
                    </div>
                    <div className="btn btn-outline-dark disabled">
                      Total Income: Rs.{totalIncome.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-container">
                  {filteredReservations.length > 0 ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Pay ID</th>
                          <th>Res ID</th>
                          <th>Per Ticket</th>
                          <th>Total</th>
                          <th>Date reserved</th>
                          <th>Time reserved</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReservations.map((res) => (
                          <tr key={res.paymentId}>
                            <td className="text-center"> <abbr title={res.paymentId}>#</abbr> </td>
                            <td className="text-center"> <abbr title={res.reservationId}><i className="fa-regular fa-calendar-check"></i></abbr> </td>
                            <td>{res.amount}</td>
                            <td>{res.checkAccept == true ? "Accepted" : "Rejected"}</td>
                            <td>{res.paymentDate}</td>
                            <td>{res.paymentTime}</td>
                            <td> {res.refundStatus} </td>
                            <td className="text-center"><button onClick={() => handleDelete(res.reservationId) } className="btn btn-outline-secondary btn-sm" > <i className="fa-solid fa-trash"></i> </button> </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No reservations found for the selected dates.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
export default AdminPayment;