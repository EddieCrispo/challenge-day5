import React, { useEffect, useMemo } from 'react'
import { Pie, Line, Bar } from 'react-chartjs-2';
import { useTransactionStore } from '../stores/transactionStore';
import { useAuth } from '../contexts/AuthContext';
import { useCategoryStore } from "../stores/categoryStore";


function Insight() {

    const { user } = useAuth();
    const { transactions, fetchTransactions } = useTransactionStore();
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        if (user.id) fetchTransactions(user.id);
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            fetchTransactions(user.id);
            fetchCategories();
        }
    }, [user]);

    // Breakdown pengeluaran berdasarkan kategori
    const expenseByCategory = useMemo(() => {
        const grouped = {};
        transactions
            .filter(tx => tx.userId === user.id)
            .forEach(tx => {
                const category = tx.category || 'Other';
                grouped[category] = (grouped[category] || 0) + Number(tx.amount || 0);
            });
        return grouped;
    }, [transactions]);

    const expenseByCategoryDetailed = useMemo(() => {
        const grouped = {};

        transactions
            .filter(tx => tx.userId === user.id)
            .forEach(tx => {
                const categoryId = tx.categoryId || 'uncategorized';
                grouped[categoryId] = (grouped[categoryId] || 0) + Number(tx.amount || 0);
            });

        return grouped;
    }, [transactions]);

    const lineChartData = useMemo(() => {
        const income = [];
        const expense = [];
        const labels = [];

        const grouped = {};

        transactions.forEach(tx => {
            const date = new Date(tx.createdAt).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = { income: 0, expense: 0 };
            }
            if (tx.receiverUserId === user.id) {
                grouped[date].income += Number(tx.amount || 0);
            }
            if (tx.userId === user.id) {
                grouped[date].expense += Number(tx.amount || 0);
            }
        });

        Object.entries(grouped).forEach(([date, value]) => {
            labels.push(date);
            income.push(value.income);
            expense.push(value.expense);
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: income,
                    backgroundColor: 'rgba(34,197,94,0.7)', // hijau
                    borderRadius: 6,
                },
                {
                    label: 'Expense',
                    data: expense,
                    backgroundColor: 'rgba(239,68,68,0.7)', // merah
                    borderRadius: 6,
                }
                // {
                //     label: 'Income',
                //     data: income,
                //     borderColor: 'green',
                //     backgroundColor: 'rgba(0, 128, 0, 0.2)',
                //     tension: 0.4
                // },
                // {
                //     label: 'Expense',
                //     data: expense,
                //     borderColor: 'red',
                //     backgroundColor: 'rgba(255, 0, 0, 0.2)',
                //     tension: 0.4
                // }
            ]
        };
    }, [transactions]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {categories.map((cat) => {
                    const amount = expenseByCategoryDetailed[cat.id];

                    if (!amount) return null; // Skip jika kategori tidak punya transaksi

                    return (
                        <div key={cat.id} className="bg-white rounded-xl shadow p-4">
                            <h3 className="text-lg font-semibold mb-4">
                                Expense in Category: {cat.name}
                            </h3>
                            <Pie
                                data={{
                                    labels: [cat.name],
                                    datasets: [
                                        {
                                            data: [amount],
                                            backgroundColor: ['#f87171'],
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    );
                })}
            </div> */}

            <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
                <div className='w-[600px] h-[600px] mx-auto'>
                    <Pie
                        data={{
                            labels: categories
                                .filter(cat => expenseByCategoryDetailed[cat.id])
                                .map(cat => cat.name),
                            datasets: [
                                {
                                    data: categories
                                        .filter(cat => expenseByCategoryDetailed[cat.id])
                                        .map(cat => expenseByCategoryDetailed[cat.id]),
                                    backgroundColor: [
                                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                                        '#F472B6', '#60A5FA', '#FCD34D', '#10B981', '#8B5CF6'
                                    ],
                                }
                            ]
                        }}
                        options={{
                            plugins: {
                                legend: {
                                    position: 'right',
                                }
                            }
                        }}
                    />
                </div>
            </div>


            <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Income vs Expense Over Time</h3>
                {/* <Line data={lineChartData} /> */}
                <div className='w-[700px] h-[600px] mx-auto'>
                    <Bar
                        data={lineChartData}
                        options={{
                            // indexAxis: 'y',
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                            },
                            scales: {
                                x: {
                                    // stacked: true,
                                },
                                y: {
                                    // stacked: true,
                                    // beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Insight