"use client";
import { useAuth } from "@/hooks/useAuth";
import React, { useState, useEffect } from "react";

interface Transaction {
  _id: string;
  userId: string;
  userName: string;
  paymentMethod: string;
  amount: number;
  phoneNumber: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionCardProps {
  className?: string;
  showHeader?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  className = "",
  showHeader = true,
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.uId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/api/v1/payment/${user.uId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`);
        }

        const data = await response.json();

        let transactionsData: Transaction[] = [];

        if (data.data) {
          transactionsData = Array.isArray(data.data) ? data.data : [data.data];
        } else if (data.payments) {
          transactionsData = Array.isArray(data.payments)
            ? data.payments
            : [data.payments];
        } else if (Array.isArray(data)) {
          transactionsData = data;
        }

        const validTransactions = transactionsData.filter(
          (transaction: Transaction) =>
            transaction &&
            typeof transaction === "object" &&
            transaction._id &&
            transaction.paymentMethod
        );

        setTransactions(validTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.uId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "short" });
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodConfig = (method: string) => {
    if (!method)
      return {
        icon: "💸",
        color: "from-gray-400 to-gray-500",
        bg: "bg-gray-400/10",
        border: "border-gray-200",
      };

    const lowerMethod = method.toLowerCase();
    switch (lowerMethod) {
      case "bkash":
        return {
          icon: "Bk",
          color: "from-pink-500 to-pink-600",
          bg: "bg-pink-500/10",
          border: "border-pink-200",
          text: "text-pink-600",
        };
      case "nagad":
        return {
          icon: "Ng",
          color: "from-green-500 to-green-600",
          bg: "bg-green-500/10",
          border: "border-green-200",
          text: "text-green-600",
        };
      case "rocket":
        return {
          icon: "Rk",
          color: "from-purple-500 to-purple-600",
          bg: "bg-purple-500/10",
          border: "border-purple-200",
          text: "text-purple-600",
        };
      case "card":
        return {
          icon: "Cd",
          color: "from-blue-500 to-blue-600",
          bg: "bg-blue-500/10",
          border: "border-blue-200",
          text: "text-blue-600",
        };
      case "bank":
        return {
          icon: "Bk",
          color: "from-indigo-500 to-indigo-600",
          bg: "bg-indigo-500/10",
          border: "border-indigo-200",
          text: "text-indigo-600",
        };
      default:
        return {
          icon: "Py",
          color: "from-gray-400 to-gray-500",
          bg: "bg-gray-400/10",
          border: "border-gray-200",
          text: "text-gray-600",
        };
    }
  };

  const getSafePaymentMethod = (transaction: Transaction) => {
    return transaction.paymentMethod || "Unknown";
  };

  if (!user) {
    return (
      <div
        className={`bg-card rounded-xl border border-border/60 shadow-sm p-6 ${className}`}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary/60"></div>
          <span className="ml-3 text-muted-foreground text-sm">
            Loading user...
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`bg-card rounded-xl border border-border/60 shadow-sm p-6 ${className}`}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary/60"></div>
          <span className="ml-3 text-muted-foreground text-sm">
            Loading transactions...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-card rounded-xl border border-border/60 shadow-sm p-6 ${className}`}
      >
        <div className="text-center py-6">
          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-destructive text-lg">⚠️</span>
          </div>
          <h3 className="text-sm font-semibold text-card-foreground mb-1">
            Failed to load
          </h3>
          <p className="text-muted-foreground text-xs mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-xs font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        className={` bg-white rounded-xl border border-border/60 shadow-sm p-6 ${className}`}
      >
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-xl text-muted-foreground">💳</span>
          </div>
          <h3 className="text-sm font-semibold text-card-foreground mb-1">
            No transactions
          </h3>
          <p className="text-muted-foreground text-xs">
            Payment history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden ${className}`}
    >
      {/* Elegant Compact Header */}
      {showHeader && (
        <div className="px-5 py-4 border-b border-border/40 bg-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">₿</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">
                  Transactions
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {transactions.length} records
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-sm font-semibold text-card-foreground">
                {formatAmount(
                  transactions.reduce((sum, t) => sum + t.amount, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Transactions List */}
      <div className="divide-y divide-border/30 max-h-80 overflow-y-auto">
        {transactions.map((transaction) => {
          const paymentMethod = getSafePaymentMethod(transaction);
          const methodConfig = getPaymentMethodConfig(paymentMethod);

          return (
            <div
              key={transaction._id}
              className="px-4 py-3 hover:bg-primary/3 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Minimal Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg ${methodConfig.bg} border ${methodConfig.border} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200`}
                  >
                    <span
                      className={`text-xs font-semibold ${methodConfig.text}`}
                    >
                      {methodConfig.icon}
                    </span>
                  </div>

                  {/* Compact Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-card-foreground truncate">
                        Payment
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${methodConfig.bg} ${methodConfig.text} font-medium`}
                      >
                        {paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{formatDate(transaction.createdAt)}</span>
                      <span>•</span>
                      <span className="truncate max-w-20">
                        {transaction.phoneNumber || "N/A"}
                      </span>
                    </div>

                    {/* Compact Transaction ID */}
                    <div className="mt-1">
                      <p className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded border border-border/30 truncate">
                        {transaction.transactionId?.slice(0, 12) + "..." ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount & User */}
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-500 mb-0.5">
                    {formatAmount(transaction.amount)}
                  </div>
                  {transaction.userName && (
                    <div className="text-xs text-muted-foreground truncate max-w-20">
                      {transaction.userName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimal Footer */}
      <div className="px-4 py-3 border-t border-border/40 bg-muted/20">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            Updated{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
