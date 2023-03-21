import { useState, useEffect } from "react";
import axios from "axios";

const BankTransactions = ({ accessToken }) => {
  const [transactions, setTransactions] = useState([]);
  const [showExpensesByCategory, setShowExpensesByCategory] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/v1/plaid/transactions?access_token=${accessToken}`
      )
      .then((response) => {
        console.log(response);
        setTransactions(response.data);
      })
      .catch((error) => {
        console.log("Error fetching transactions:", error);
      });
  }, [accessToken]);

  const showExpenses = () => {
    setShowExpensesByCategory(true);
  };

  const goBack = () => {
    setShowExpensesByCategory(false);
  };

  const expensesByCategory = transactions.reduce((accumulator, transaction) => {
    transaction.category.forEach((category) => {
      accumulator[category] = (accumulator[category] || 0) + transaction.amount;
    });
    return accumulator;
  }, {});

  return (
    <div>
      {!showExpensesByCategory && (
        <div className="transactions-container">
          <h2 className="title-transactions">Your Bank Transactions</h2>
          <button onClick={showExpenses}>Expenses by Category</button>
          {transactions && transactions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.name}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.category.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading Your Bank Transactions...</p>
          )}
        </div>
      )}
      {showExpensesByCategory && (
        <div className="transactions-container">
          <h2 className="title-transactions">Expenses by Category</h2>
          <button onClick={goBack}>Back to Transactions</button>
          {Object.entries(expensesByCategory).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(expensesByCategory).map(([category, total]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Expenses by Category Found...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BankTransactions;
